const config = require("./utilities/config");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const requestLogger = require("./middleware/requestLogger");

const itemController = require("./controllers/itemController");
const userController = require("./controllers/userController");
const loginController = require("./controllers/loginController");
const signUpController = require("./controllers/signUpController");

app.use(cors());
app.use(express.json());
app.use(requestLogger);

///Database mongo
mongoose
    .connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 20000,
        serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB", error.message);
    });

//REST Api mongo
app.use("/api/items", itemController);
app.use("/api/users", userController);
app.use("/api/login", loginController);
app.use("/api/signup", signUpController);

module.exports = app;
