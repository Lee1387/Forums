import mongoose from "mongoose";
const { Schema, model } = mongoose;

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 300,
            trim: true,
        },
        likes: {
            type: Number,
            required: true,
            default: 0,
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

const Comment = model("Comment", commentSchema);

export { Comment, commentSchema };