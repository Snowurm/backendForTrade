const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    type: String,
    count: Number,
    price: Number,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
    },
});

itemSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const ItemModel = mongoose.model("ItemModel", itemSchema);

module.exports = ItemModel;
