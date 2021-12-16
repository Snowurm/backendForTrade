const { ENVIRONMENT } = require("./config");

const log = (...params) => {
    if (!(ENVIRONMENT === "test")) {
        console.log(...params);
    }
};

const err = (...params) => {
    if (!(ENVIRONMENT === "test")) {
        console.error(...params);
    }
};

module.exports = { log, err };
