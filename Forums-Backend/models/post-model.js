import mongoose from "mongoose";

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
            type: [String],
            required: true,
            default: [],
        },
        hasBeenEdited: {
            type: Boolean,
            required: true,
            default: false,
        },
        history: {
            type: [Object],
            required: true,
            default: [],
        },
        profileImageName: {
            type: String,
            required: true,
            default: "blank.png",
        },
        profileImageAlt: {
            type: String,
            required: true,
            default: "A generic blank avatar image of a mans head",
        },
    },
    {
        timestamps: true,
    }
);

const Post = model("Post", postSchema);

export { Post };