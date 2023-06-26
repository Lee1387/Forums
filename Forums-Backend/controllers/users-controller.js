import bcrypt from "bcrypt";

import { User } from "../models/user-model.js";
import { Post } from "../models/post-model.js";
import { Comment } from "../models/comment-model.js";
import { wrapper } from "./wrapper.js";

const createNewUser = wrapper(async (req, res) => {
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
    console.log(hashedPassword, req.ip);
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

const changeRoleToMod = wrapper(async (req, res) => {
    const userRole = req.role;
    const modUsername = req.body.modUsername;
    if (userRole !== "admin") {
        throw new Error(
            "Role Error: Attempt to create mod without admin access"
        );
    }
    if (!modUsername) {
        throw new Error("User id of new mod not provided");
    }
    const dbMod = await User.findOne({ username: modUsername });
    if (!dbMod) {
        throw new Error("That user does not exist");
    }
    await User.findOneAndUpdate(
        { username: modUsername },
        {
            $set: {
                role: "mod",
            },
        }
    );

    res.status(201);
    res.json({
        status: "Mod role updated successfully",
    });
});

const updateProfilePic = wrapper(async (req, res) => {
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

export { createNewUser, changeRoleToMod, updateProfilePic, deleteOwnAccount };