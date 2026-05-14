const {redis} = require('../config/database');

class BaseController {
    constructor() {
        this.redis = redis;
    }
}

module.exports = BaseController;