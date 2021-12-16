const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        unique: true,
        required: true,
    },
    firstName: {
        type: String,
        minlength: 2,
        required: true,
    },
    lastName: {
        type: String,
        minlength: 1,
        required: true,
    },
    eMail: {
        type: String,
    },
    passwordHash: {
        type: String,
        required: true,
        minlength: 1,
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ItemModel",
        },
    ],
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
