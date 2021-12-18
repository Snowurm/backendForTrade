const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const UserModel = require("../models/userModel");
const ItemModel = require("../models/itemModel");
const res = require("express/lib/response");

userRouter.post("/", async (req, res) => {
    try {
        const body = req.body;
        const saltRounds = 10;
        if (body?.password?.length < 4) {
            throw { error: "Password length is less than 4." };
        }
        const passwordHash = await bcrypt.hash(body?.password, saltRounds);
        const userBlueprint = new UserModel({
            ...body,
            passwordHash,
        });

        const user = await userBlueprint.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err?.message);
    }
});

userRouter.get("/", async (req, res) => {
    try {
        const result = await UserModel.find({}).populate("items");
        res.status(200).json(result);
    } catch (err) {
        res.status(401).send(err);
    }
});

userRouter.put("/", async (req, res) => {
    res.status(401).send({ message: "not available" });
});

userRouter.delete("/", async (req, res) => {
    try {
        const result = await UserModel.deleteMany({});
        res.status(200).send({ result: result });
    } catch (err) {
        res.status(401).send(err);
    }
});

userRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await UserModel.findById(id);
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json(err);
    }
});

userRouter.post("/:id", async (req, res) => {
    res.status(200).send({ message: "unimplemented." });
});

userRouter.put("/:id", async (req, res) => {
    res.status(200).send({ message: "unimplemented." });
});
userRouter.delete("/:id", async (req, res) => {
    const result = await UserModel.findById(req.params.id);
    if (result) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});
userRouter.get("/:id/items", async (req, res) => {
    try {
        const dbUser = await UserModel.findById(req.params.id).populate(
            "items"
        );
        res.status(200).json(dbUser.items);
    } catch (err) {
        res.status(401).send(err);
    }
});

userRouter.post("/:id/items", async (req, res) => {
    try {
        const body = req.body;
        const dbUser = await UserModel.findById(req.params.id);

        const item = {
            type: body.type,
            count: body.count,
            price: body.price,
            owner: dbUser.id,
        };

        const dbItem = new ItemModel(item);
        const savedItem = await dbItem.save();
        dbUser.items = dbUser.items.concat(savedItem.id);
        await dbUser.save();
        res.status(200).json(savedItem);
    } catch (err) {
        res.status(400).json(err?.message);
    }
});
userRouter.get("/:id/items/:idb", async (req, res) => {
    try {
        const dbUser = await UserModel.findById(req.params.id);
        const dbItem = await ItemModel.findById(req.params.idb);
        
        res.status(200).json(dbUser.items);
    } catch (err) {
        res.status(401).send(err);
    }
});
userRouter.delete("/:id/items/:idb", async (request, response) => {
    try {
        const dbUser = await UserModel.findById(req.params.id);
        const dbItem = await ItemModel.findByIdAndRemove(req.params.idb);
        dbUser.items.reduce((result, i) => {
            if (i.id === dbItem.id) {
                return result;
            } else {
                return result.concat(i);
            }
        }, []);
        await dbUser.save();
        res.status(200);
    } catch (err) {
        res.status(400).json(err?.message);
    }

    // const blog = await Blog.findById(request.params.id);
    // const comment = await Comment.findById(rqeuest.params.idb);

    // if(decodedToken.id.toString() === blog.user.toString())
    // {
    //   await Blog.findByIdAndRemove(request.params.id);
    //   response.status(204).end();
    // }
    // else
    // {
    //   response.status(401).json({ error:'incorrect authorization for this operation.' }).end();
    // }
});

// blogsRouter.post('/:id/comments', async (req, res) => {
//     const body = req.body;
//     const blog = await Blog.findById(req.params.id);

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
