const { log } = require("../utilities/logger");

const requestLogger = (request, response, next) => {
    log("hello");
    log("Method:", request.method);
    log("Path:  ", request.path);
    log("Body:  ", request.body);
    log("---");
    next();
};

module.exports = requestLogger;
