import bcrypt from "bcrypt";

import { User } from "../models/user-model.js";
import { Post } from "../models/post-model.js";
import { Comment } from "../models/comment-model.js";
import { wrapper } from "./wrapper.js";

const createNewUser = wrapper(async (req, res) => {
    if (!req.body.username || !req.body.password) {
        throw new Error(
            "Bad Request Error: Username or password was not provided"
        );
    }
    if (
        typeof req.body.username !== "string" ||
        typeof req.body.password !== "string"
    ) {
        throw new Error(
            "Bad Request Error: Username or password was not provided"
        );
    }
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
        msg: "New account created successfully",
    });
});

const updateProfilePic = wrapper(async (req, res) => {
    const userId = req.userId;
    const newProfilePicName = req.body.name;
    const newProfilePicAlt = req.body.alt;
    if (!newProfilePicName || !newProfilePicAlt) {
        throw new Error(
            "Bad Request Error: Picture name or alt was not provided"
        );
    }
    await User.findOneAndUpdate(
        { _id: userId },
        {
            $set: {
                profileImageName: String(newProfilePicName),
                profileImageAlt: String(newProfilePicAlt),
            },
        }
    );
    res.status(200);
    res.json({ msg: "Profile picture updated successfully" });
});

const deleteOwnAccount = wrapper(async (req, res) => {
    const dbUser = await User.findOne({ _id: req.userId });
    if (!dbUser) {
        throw new Error(
            "Not Found Error: No user found matching those credentials"
        );
    }
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
    const userComments = await Comment.find({ _id: { $in: userCommentIds } });
    const relatedPostIds = userComments.map((commentObj) => {
        return commentObj.relatedPost;
    });
    const relatedPosts = await Post.find({ _id: { $in: relatedPostIds } });
    for (const post of relatedPosts) {
        const newRelatedComments = posts.comments.filter((commentId) => {
            return !userCommentIds.includes(commentId);
        });
        await Post.findOneAndUpdate(
            { _id: post._id },
            { comments: newRelatedComments },
        );
    }

    if (userCommentIds.length > 0) {
        await Comment.deleteMany({ _id: { $in: userCommentIds } });
    }
    await User.findByIdAndDelete({ _id: dbUser._id });
    res.status(200);
    res.json({ msg: "Account deleted successfully" });
});

export { createNewUser, updateProfilePic, deleteOwnAccount };