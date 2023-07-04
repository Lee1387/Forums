import React from "react";
import { useLoaderData, useParams, Link } from "react-router-dom";

export async function postsTopicLoader({ params }) {
    try {
        const response = await fetch("/src/assets/test-data.json");
        const data = await response.json();
        //const topic = params.topic;
        return data;
    } catch (error) {
        return error;
    }
}

export default function PostsByTopic() {
    const topic = useParams().topic;
    const postData = useLoaderData();
    const postElements = postData.map((post) => {
        return (
            <div key={post._id}>
                <Link to={`/posts/details/${post._id}`}>
                    <h3>{post.title}</h3>
                </Link>
            </div>
        );
    });

    return (
        <>
            <h2>Posts about {topic}</h2>
            {postData ? (
                <div>{postElements}</div>
            ) : (
                <p>Post data is unavailable at this time</p>
            )}
        </>
    );
}