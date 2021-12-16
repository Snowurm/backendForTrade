const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const config = require("../utilities/config");
const jwt = require("jsonwebtoken");
const { log } = require("../utilities/logger");

const createSessionToken = async (req, res, next) => {
    const body = req.body;
    const user = await UserModel.findOne({ username: body.username });
    const authorization =
        user !== null
            ? await bcrypt.compare(body.password, user.passwordHash)
            : false;
    if (!authorization) {
        return res.status(401).json({ error: "invalid username or password." });
    } else {
        const userForToken = {
            username: user.username,
            id: user._id,
        };
        const token = jwt.sign(userForToken, config.SECRET);
        body.sessionToken = token;
        body.user = user;
        //No issues creating a token
        next();
    }
};

const decodeAuth = async (req, res, next) => {
    // log("====================================");
    // log("beep validateToken beep");
    const body = req.body;
    // log("------------------------------------");
    // log("received headers: ", req.headers);
    // log("------------------------------------");
    const authorization = req.headers["authorization"];
    // console.log("authorization: ", authorization);
    // log("------------------------------------");
    jwt.verify(authorization, config.SECRET, (err, result) => {
        if (err) {
            res.status(401).send({ error: "invalid token." });
            return err;
        } else {
            body.decodedToken = result;
            next();
        }
    });

    // console.log("result: ", decodedToken);
    // log("------------------------------------");
    // log("boop validateToken boop");
    // log("====================================");
};

const getUserAuth = async (req, res, next) => {
    //anyone who is logged in can view other users
    const authHeader = req.headers["authorization"];
    const auth = authHeader?.split(" ")[1];
    const sessionToken = auth ? auth : false;
    const body = req.body;
    const decodedToken = jwt.verify(
        sessionToken,
        config.SECRET,
        (err, result) => {
            if (err) {
                body.tokenValidation = false;
                return err;
            }
            body.tokenValidation = true;
            return result;
        }
    );
    body.sessionToken = sessionToken;
    body.decodedToken = decodedToken;
    next();
};

// loginRouter.get("/", validateToken, async (req, res) => {
//     const sessionToken = req.body.sessionToken;
//     const decodedToken = req.body.decodedToken;
//     const tokenValidation = req.body.tokenValidation;

//     if (!tokenValidation) {
//         res.status(401).send({ error: "invalid token." });
//         // return res.status(401).json({ error: "invalid token." });
//     } else {
//         const user = await UserModel.findOne({
//             username: decodedToken.username,
//             id: decodedToken.id,
//         });
//         res.status(200).send(user);
//     }
// });

// loginRouter.post("/", createSessionToken, async (req, res) => {
//     const user = req.body.user;
//     const sessionToken = req.body.sessionToken;
//     const result = { user, sessionToken };
//     res.status(200).send(result);
// });

module.exports = { createSessionToken, decodeAuth };
