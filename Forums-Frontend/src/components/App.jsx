import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
// Components
import MainLayout from "./MainLayout";
import Error from "./Error";
import Results, { resultsLoader } from "./Results";
// Pages
import Home, { homeLoader } from "../pages/Home";
import Search, { searchAction } from "../pages/Search";
import Post, { postLoader } from "../pages/Post";
import PostsByTopic, { postsTopicLoader } from "../pages/PostsByTopic";
import CreatePost, { createPostAction } from "../pages/CreatePost";
import NotFound from "../pages/NotFound";
// Assets
import "../assets/styles.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route path="/" element={<Home />} loader={homeLoader} />
      <Route 
        path="/search" 
        element={<Search />}
        loader={resultsLoader}
        action={searchAction}
      />
      <Route path="/posts">
        <Route
            path=":topic"
            element={<PostsByTopic />}
            loader={postsTopicLoader}
          />
          <Route
            path="details/:id"
            element={<Post />}
            loader={postLoader}
          />
      </Route>
        <Route
            path="/create"
            element={<CreatePost />}
            action={createPostAction}
        />
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}