require("dotenv").config();
require("reflect-metadata");
const glob = require("glob");
const Koa = require("koa");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const compress = require("koa-compress");
const zlib = require("zlib");
const config = require("./config");
const { log } = require("./middleware/index");
const { createServer } = require("http");
const { initSocket } = require("./socket/socketHandler.js");
const geoDataSyncCronJob = require("./service/geoDataSyncCronJob");
require("./config/database"); 

const app = new Koa();

app.use(bodyParser());
app.use(cors({
  origin: (ctx) => {
    return '*';
  },
  credentials: true,
  allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(
  compress({
    threshold: 2048,
    flush: zlib.Z_SYNC_FLUSH,
    level: 9,
  })
);

app.use(log);

async function startServer() {
  try {

    glob(`${__dirname}/routes/*.js`, { ignore: "**/index.js" }, (err, matches) => {
      if (err) {
        throw err;
      }

      matches.forEach((file) => {
        const controller = require(file);
        app.use(controller.routes()).use(controller.allowedMethods());
      });

      const httpServer = createServer(app.callback());
      initSocket(httpServer);
      
      httpServer.listen(config.port, () => {
        console.log(` Server is running on port ${config.port}`);
        geoDataSyncCronJob.start();
      });
    });
  } catch (err) {
    console.error(' Server startup failed:', err.message);
    process.exit(1);
  }
}

if (!module.parent) {
  startServer();
}
