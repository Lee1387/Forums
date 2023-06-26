import { wrapper } from "./wrapper.js";
import { Post } from "../models/post-model.js";
import { User } from "../models/user-model.js";
import { Comment } from "../models/comment-model.js";

const createPost = wrapper(async (req, res) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN);
    const topic = req.body.topic;
    const title = req.body.title;
    const content = req.body.content;
    const username = req.username;
    const keywords = req.body.keywords ? req.body.keywords.split(" ") : [];
    const allowedTopics = ["movies", "books", "games", "other"];
    if (!allowedTopics.includes(topic)) {
        throw new Error("Bad Request Error: Topic not allowed!");
    }
    if (!title || !content) {
        throw new Error("Bad Request Error: Title or content not provided!");
    }
    const dbUser = await User.findOne({ _id: req.userId });
    const dbPost = await Post.create({
        title: title,
        content: content,
        topic: topic,
        user: username,
        keywords: keywords,
    });

    await User.findOneAndUpdate(
        { _id: dbUser._id },
        {
            $set: {
                posts: [
                    ...dbUser.posts,
                    { id: dbPost._id, title: dbPost.title },
                ],
            },
        }
    );
    res.status(201);
    res.json(dbPost);
});

const getPost = wrapper(async (req, res) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN);
    const postId = req.params.id;
    const requestedPost = await Post.findOne({ _id: String(postId) });
    if (!requestedPost) {
        throw new Error(
            "Not Found Error: No post found within that id, it may have been deleted"
        );
    }
    const relatedComments = [];
    const commentIds = requestedPost.comments;
    for (const id of commentIds) {
        const matching = await Comment.findOne({ _id: String(id) });
        relatedComments.push(matching);
    }
    res.status(200);
    res.json({ post: requestedPost, comments: relatedComments });
});

const getPostsByTopic = wrapper(async (req, res) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN);
    const postsTopic = req.params.topic;
    const requestedPost = await Post.find({ topic: String(postsTopic) }).limit(
        20
    );
    res.status(200);
    res.json(requestedPost);
});

const getPostsByUser = wrapper(async (req, res) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN);
    const userId = req.params.id;
    const dbUser = await User.findOne({ _id: String(userId) });
    if (!dbUser) {
        throw new Error("No user account found, it may have been deleted!");
    }
    const userPostsIds = dbUser.posts;
    res.status(200);
    res.json(userPostsIds);
});

const likePost = wrapper(async (req, res) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN);
    const postId = req.params.id;
    const dbUser = await User.findOne({ _id: String(req.userId) });
    // Did user like or unlike post
    let didUserLike = true;
    let newLikedPosts = [];
    if (dbUser.likedPosts.includes(postId)) {
        didUserLike = false;
        newLikedPosts = dbUser.likedPosts.filter((id) => {
            return id !== postId;
        });
    } else {
        newLikedPosts = [...dbUser.likedPosts, postId];
    }
    await User.findOneAndUpdate(
        { _id: dbUser._id },
        {
            $set: {
                likedPosts: newLikedPosts,
            },
        }
    );

    const dbPost = await Post.findOne({ _id: String(postId) });
    const numberOfLikes = didUserLike ? dbPost.likes + 1 : dbPost.likes - 1;
    await Post.findOneAndUpdate(
        { _id: dbPost._id },
        {
            $set: {
                likes: numberOfLikes,
            },
        }
    );
    res.status(200);
    res.json({
         status: "Post liked successfully",
          likes: numberOfLikes,
          didUserLike,
    });
});

export { createPost, getPost, getPostsByTopic, getPostsByUser, likePost };