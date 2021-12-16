require("dotenv").config();

const PORT = process.env.PORT;
const DEV_MONGODB_URI = process.env.DEV_MONGODB_URI;
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;
const SECRET = process.env.SECRET;
const ENVIRONMENT = process.env.NODE_ENV;

const MONGODB_URI =
    process.env.NODE_ENV === "test"
        ? process.env.TEST_MONGODB_URI
        : process.env.DEV_MONGODB_URI;

module.exports = {
    PORT,
    DEV_MONGODB_URI,
    TEST_MONGODB_URI,
    SECRET,
    ENVIRONMENT,
    MONGODB_URI,
};
