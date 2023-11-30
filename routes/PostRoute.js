const express = require("express");
const router = express.Router();
const Post = require("../models/PostModel");
const Comment = require("../models/CommentModel");

// Create a new post
router.post("/addpost", async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all posts
router.get("/getposts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a post by ID
router.put("/getposts/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post updated successfully", post: updatedPost });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a post by ID
router.delete("/getposts/:id/delete", async (req, res) => {
  const postId = req.params.id;

  try {
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted successfully", post: deletedPost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new comment to a post
router.post("/getposts/:postId/comments", async (req, res) => {
  const postId = req.params.postId;

  try {
    const newComment = new Comment({
      text: req.body.text,
      post: postId,
      author: req.body.author,
    });

    const savedComment = await newComment.save();

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: savedComment });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all comments for a specific post
router.get("/getposts/:postId/comments", async (req, res) => {
  const postId = req.params.postId;

  try {
    const comments = await Comment.find({ post: postId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a comment by ID
router.delete("/comments/:id", async (req, res) => {
  const commentId = req.params.id;

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({
      message: "Comment deleted successfully",
      comment: deletedComment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
