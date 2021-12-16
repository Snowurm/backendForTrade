const config = require("../utilities/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const UserModel = require("../models/userModel");
const { createSessionToken, decodeAuth } = require("../middleware/jwtMethods");
const { log } = require("../utilities/logger");

//returns current logged in user from database
loginRouter.get("/", decodeAuth, async (req, res) => {
    const decodedToken = req.body.decodedToken;

    const user = await UserModel.findOne({
        ...decodedToken,
    });

    const result = { user };
    res.status(200).send(result);
});

loginRouter.post("/", createSessionToken, async (req, res) => {
    const user = req.body.user;
    const sessionToken = req.body.sessionToken;

    const result = { user, sessionToken };
    res.status(200).send(result);
});

loginRouter.put("/", async (req, res) => {
    res.status(200).send({ message: "unimplemented." });
});

loginRouter.delete("/", decodeAuth, async (req, res) => {
    res.status(200).send({ message: "unimplemented." });
});

module.exports = loginRouter;
