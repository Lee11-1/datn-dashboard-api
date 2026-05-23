const _ = require("lodash");
const uuid = require("uuid/v4");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const coreEngineApi = require('../integration/coreEngineApi');

const loggingMethod = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const loggingPathIgnore = ["/login", "/api-logs-database", "/api-logs"];

class Log {
  constructor(data) {
    this.data = data;
  }

  async createLog() {
    console.log("Request Log:", JSON.stringify(this.data, null, 2));
        try {
      const logPayload = {
        action: `${this.data.method} ${this.data.matched_route}`,
        entityType: 'API_REQUEST',
        level: this.data.status >= 400 ? (this.data.status >= 500 ? 'error' : 'warning') : 'info',
        userId: this.data.user || null,
        ipAddress: this.data.ipAddress || null,
        userAgent: this.data.userAgent || null,
        metadata: {
          path: this.data.path,
          matched_route: this.data.matched_route,
          method: this.data.method,
          status: this.data.status,
          request: this.data.request,
          response: this.data.response.data||this.data.response
        }
      };
      if (this.data.method === "POST" || this.data.method === "PUT" || this.data.method === "PATCH" || this.data.method === "DELETE") {
        await coreEngineApi.createLog(logPayload);
      }
    } catch (error) {
      console.error('Failed to send log to core-engine:', error.message);
    }
  }
}

async function authorize(ctx, next) {
  const authHeader = ctx.headers.authorization;
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { code: "NO_TOKEN", message: "No token provided" };
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    ctx.status = 401;
    ctx.body = { code: "INVALID_TOKEN", message: "Invalid token format" };
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.User = decoded;
    await next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      ctx.status = 401;
      ctx.body = { code: "TOKEN_EXPIRED", message: "Access token expired" };
    } else {
      ctx.status = 401;
      ctx.body = { code: "INVALID_TOKEN", message: "Invalid token" };
    }
  }
}

const authorizeRole = (roles) => {
  return async (ctx, next) => {
    const user = ctx.User;
    
    if (!user || !roles.includes(user.role)) {
      ctx.status = 403;
      ctx.body = { code: 'FORBIDDEN', message: 'Bạn không có quyền thực hiện chức năng này' };
      return;
    }
    
    await next();
  };
};

async function log(ctx, next) {
  let error = null;
  ctx.request.id = uuid().replace(/-/g, ""); // because hyphen sucks
  try {
    await next();
  } catch (err) {
    error = err;
    if (err.code === "ECONNREFUSED") {
      ctx.status = 504;
      ctx.body = {
        code: err.code,
        message: err.message,
      };
    }  else if (err.name === "AuthenticationError") {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: err.message,
      };
    } else {
      ctx.status = 400;
      const body = {
        code: 400,
        message: err.message,
        verbosity: err.verbosity,
      };

      ctx.body = body;
    }
  }

  const { _matchedRoute: matchedRoute } = ctx;

  if (
    loggingMethod.includes(ctx.method) &&
    !loggingPathIgnore.includes(matchedRoute)
  ) {
    const user = ctx.User;
    const requestLog = new Log({
      path: ctx.path,
      matched_route: matchedRoute,
      method: ctx.method,
      user: user ? user.id : ctx.request.headers["x-key"],
      status: ctx.status,
      request: {
        query: ctx.query,
        body: ctx.request.body,
      },
      response: error || ctx.body,
      ipAddress: ctx.ip,
      userAgent: ctx.headers['user-agent']
    });

    requestLog.createLog().catch(err => {
      console.error('Logging error:', err.message);
    });
  }
}

module.exports = {
  authorize,
  log,
  authorizeRole,
};
