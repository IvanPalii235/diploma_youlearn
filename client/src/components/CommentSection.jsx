"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

const CommentsSection = ({ courseId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:4000/course/${courseId}/comments`);
        if (!res.ok) {
          throw new Error("Failed to fetch comments");
        }
        const commentsData = await res.json();
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [courseId]);

  const handleAddComment = async () => {
    try {
      const res = await fetch(`http://localhost:4000/courses/${courseId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie.split('token=')[1]}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      if (!res.ok) {
        throw new Error("Failed to add comment");
      }
      const comment = await res.json();
      setComments((prevComments) => [...prevComments, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div>
      <h3>Add a Comment:</h3>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <Button onClick={handleAddComment}>Add Comment</Button>
      <div>
        <h3>Comments:</h3>
        {comments.map((comment) => (
          <div key={comment.id}>
            <p>{comment.content}</p>
            <p>{new Date(comment.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
