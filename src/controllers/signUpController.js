const config = require("../utilities/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const signUpRouter = require("express").Router();
const UserModel = require("../models/userModel");
const { createSessionToken, decodeAuth } = require("../middleware/jwtMethods");
const { log } = require("../utilities/logger");

//returns current logged in user from database
signUpRouter.get("/", async (req, res) => {
    const body = req.headers;
    log("signUp - Get: ", body);
    res.status(200).json(body);
    // res.status(404).send();
});

signUpRouter.post("/", async (req, res) => {
    const body = req.body;
    const doesUserAlreadyExist = await UserModel.findOne({
        username: body.username,
    });

    //requirements for creating a new user, else 401 with error.
    //1. can't find an user with same username
    //2. password exists
    //3. password is longer than 3 characters
    const allowedUsername = doesUserAlreadyExist === null ? true : false;
    const allowedPassword = body.password?.length > 3 ? true : false;

    const passesChecks = allowedUsername === true && allowedPassword === true;

    if (passesChecks) {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(body.password, saltRounds);
        // const name = body.firstName + " " + body.lastName;
        const userBlueprint = new UserModel({
            ...body,
            passwordHash,
        });
        // console.log(
        //     "UserBlueprint::::NewUserCreated::::::::::::::::::" + userBlueprint
        // );
        const user = await userBlueprint.save();
        // console.log(
        //     "UserBlueprint::::NewUserResult! :)::::::::::::::::::" + user
        // );
        res.json(user);
        // res.status(200).send();
    } else {
        res.status(400).json({
            message: "Bad request while creating a new user.",
        });
    }

    res.status(418).send();
});

signUpRouter.put("/", async (req, res) => {
    log("signUp - Update");
    res.status(404).send();
});

signUpRouter.delete("/", decodeAuth, async (req, res) => {
    const body = req.body;
    const decodedToken = body.decodedToken;
    const username = decodedToken.username;
    const id = decodedToken.id;
    // const deletedUser = await UserModel.findOne({
    //     username: username,
    // });
    const deletedUser = await UserModel.findOneAndRemove({
        username: username,
    });

    // log("====================================");
    // log("signUp - Delete - beep");
    // log("------------------------------------");
    // console.log("username and id: ", username, id);
    // log("------------------------------------");
    // console.log("deleted user: ", deletedUser);
    // log("------------------------------------");
    // log("signUp - Delete - boop");
    // log("====================================");
    res.status(200).send({ deletedUser: deletedUser });
});

module.exports = signUpRouter;
