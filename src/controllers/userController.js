const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const UserModel = require("../models/userModel");
const ItemModel = require("../models/itemModel");

userRouter.post("/", async (req, res) => {
    const body = req.body;

    try {
        const doesUserAlreadyExist = await UserModel.findOne({
            username: body.username,
        });
        if (doesUserAlreadyExist) {
            throw { error: "User already exists.", user: doesUserAlreadyExist };
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(body.password, saltRounds);

        const userBlueprint = new UserModel({
            ...body,
            passwordHash,
        });
        const user = await userBlueprint.save();
        console.log("await result:::", user);
        res.json(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

userRouter.get("/", async (request, res) => {
    try {
        const result = await UserModel.find({}).populate("items");
        res.status(200).json(result);
    } catch (err) {
        res.status(401).send(err);
    }
});

userRouter.put("/", async (request, res) => {
    res.status(401).send({ message: "not available" });
});

userRouter.delete("/", async (request, res) => {
    try {
        const result = await UserModel.deleteMany({});
        res.status(200).send({ result: result });
    } catch (err) {
        res.status(401).send(err);
    }
});

userRouter.get("/:id", async (request, res) => {
    const id = request.params.id;
    try {
        const result = await UserModel.findById(id);
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json(err);
    }
});

userRouter.post("/:id", async (request, res) => {
    res.status(200).send({ message: "unimplemented." });
});

userRouter.put("/:id", async (request, res) => {
    res.status(200).send({ message: "unimplemented." });
});
userRouter.delete("/:id", async (request, res) => {
    const result = await UserModel.findById(request.params.id);
    if (result) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});
userRouter.post("/:id/items", async (req, res) => {
    try {
        const body = req.body;
        const item = body.item;
        const dbUser = await UserModel.findById(req.params.id);
        const dbItem = new ItemModel({
            type: item.type,
            count: item.count,
            price: item.price,
            owner: dbUser.id,
        });
        //Continue here
    } catch (error) {
        res.status(400).json(err);
    }
});
// blogsRouter.post('/:id/comments', async (request, res) => {
//     const body = request.body;
//     const blog = await Blog.findById(request.params.id);

//     const comment = new Comment({
//       content: body.content,
//       likes: body.likes || 0
//     });
//     try {
//       const savedComment = await comment.save();
//       blog.comments = blog.comments.concat(savedComment._id);
//       await blog.save();
//       const responseData = await Comment.find({ '_id': savedComment._id });
//       res.json(responseData).end();
//     } catch (error) {
//       console.log(error);
//       res.status(400).json(error);
//     }
//   });
module.exports = userRouter;
