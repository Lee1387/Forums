import bcrypt from "bcrypt";

import { User } from "../models/user-model.js";
import { Post } from "../models/post-model.js";
import { Comment } from "../models/comment-model.js";
import { wrapper } from "./wrapper.js";

const createNewUser = wrapper(async (req, res) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN);
    const displayName = req.body.username;
    const username = displayName.toLowerCase();
    const password = req.body.password;
    const requestedUsername = await User.findOne({
        username: username,
    });
    if (requestedUsername?.username) {
        throw new Error("Username unavailable Error: Duplicate entry");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userInfo = {
        username: username,
        password: hashedPassword,
        displayName: displayName,
    };
    await User.create(userInfo);

    res.status(201);
    res.json({
        status: "New account created successfully",
    });
});

const updateProfilePic = wrapper(async (req, res) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN);
    const userId = req.userId;
    const newProfilePicName = req.body.name;
    const newProfilePicAlt = req.body.alt;
    await User.findOneAndUpdate(
        { _id: userId },
        {
            $set: {
                profileImageName: newProfilePicName,
                profileImageAlt: newProfilePicAlt,
            },
        }
    );
    res.status(200);
    res.json({ status: "Profile picture updated successfully" });
});

const deleteOwnAccount = wrapper(async (req, res) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN);
    const dbUser = await User.findOne({ _id: req.userId });
    const userPostIds = dbUser.posts.map((postObj) => {
        return postObj.id;
    });
    if (userPostIds.length > 0) {
        await Post.updateMany(
            { _id: { $in: userPostIds } },
            {
                user: "Deleted",
                content: "This post has been deleted",
                keywords: [],
                history: [],
                hasBeenEdited: false,
            }
        );
    }
    const userCommentIds = dbUser.comments || [];
    if (userCommentIds.length > 0) {
        await Comment.deleteMany({ _id: { $in: userCommentIds } });
    }
    await User.findByIdAndDelete({ _id: dbUser._id });
    res.status(200);
    res.json({ msg: "Account deleted successfully" });
});

export { createNewUser, updateProfilePic, deleteOwnAccount };