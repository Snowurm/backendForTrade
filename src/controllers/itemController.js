const itemRouter = require("express").Router();
const ItemModel = require("../models/itemModel");
const UserModel = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;
const { decodeAuth } = require("../middleware/jwtMethods");
itemRouter.post("/", decodeAuth, async (req, res) => {
    const decodedToken = req.body.decodedToken;

    const user = await UserModel.findOne({
        ...decodedToken,
    });

    const body = req.body;
    if (body.type && body.count && body.price) {
        console.log(user);
        const item = new ItemModel({
            type: body.type,
            count: body.count,
            price: body.price,
            owner: user,
        });

        const savedItem = await item.save();
        const responseData = await ItemModel.find({ _id: savedItem.id });

        res.json(responseData).end();
    } else {
        return response
            .status(400)
            .json({ error: "missing information", body });
    }
});
itemRouter.get("/", async (request, response) => {
    const items = await ItemModel.find({});
    response.json(items);
});
itemRouter.put("/", async (request, response) => {
    console.log("unimplemented2.");
});
itemRouter.delete("/", async (request, response) => {
    console.log("unimplemented3.");
});
itemRouter.post("/:id", async (request, response) => {
    console.log("unimplemented4.");
});
itemRouter.get("/:id", async (request, response) => {
    let isValidId = ObjectId.isValid(request.params.id);
    if (isValidId) {
        const item = await ItemModel.findById(request.params.id);
        if (item) {
            response.json(item);
        } else {
            response.status(404).end();
        }
    } else {
        response.status(404).end();
    }
});
itemRouter.put("/:id", async (request, response) => {
    const config = { new: true };
    const body = request.body;
    const item = {
        type: body.type,
        count: body.count,
        price: body.price,
    };
    const isValid =
        ObjectId.isValid(request.params.id) &&
        typeof body.count === "number" &&
        typeof body.price === "number";
    if (isValid) {
        const result = await ItemModel.findByIdAndUpdate(
            request.params.id,
            item,
            config
        );
        if (result) {
            response.json(result);
        } else {
            response.status(501).end();
        }
    } else {
        response.status(501).end();
    }
});
itemRouter.delete("/:id", async (request, response) => {
    const isValid = ObjectId.isValid(request.params.id);
    if (isValid) {
        await ItemModel.findByIdAndRemove(request.params.id);
    }
    response.status(204).end();
});

module.exports = itemRouter;
