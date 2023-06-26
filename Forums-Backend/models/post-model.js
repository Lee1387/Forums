import mongoose from "mongoose";

import { commentSchema } from "./comment-model.js";

const { Schema, model } = mongoose;

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 60,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 900,
            trim: true,
        },
        topic: {
            type: String,
            required: true,
            trim: true,
        },
        likes: {
            type: Number,
            required: true,
            default: 0,
        },
        user: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 18,
            default: "User",
        },
        keywords: {
            type: [String],
            required: true,
            default: [],
        },
        comments: {
            ype: [commentSchema],
            required: true,
            default: [],
        },
        history: {
            type: [String],
            required: true,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Post = model("Post", postSchema);

export { Post };