"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CourseDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonContentType, setNewLessonContentType] = useState("TEXT");

  useEffect(() => {
    if (id) {
      fetchCourseDetails(id);
      checkEnrollment(id);
    }
  }, [id]);

  const fetchCourseDetails = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:4000/course/${courseId}`);
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  const checkEnrollment = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/course/${courseId}/enrollment`,
        {
          headers: {
            Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
          },
        }
      );

      if (response.ok) {
        setIsEnrolled(true);
      } else {
        setIsEnrolled(false);
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

  const handleEnroll = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/course/${id}/enroll`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to enroll in course");
      }

      setIsEnrolled(true);
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
      <p>{course.description}</p>
      <p>Category: {course.category}</p>
      <p>Price: {course.price}</p>
      <p>
        Teacher: {course.teacherName} {course.teacherLName} (
        {course.teacher.email})
      </p>
      {course.previewImage && (
        <img
          src={`http://localhost:4000/uploads/${course.previewImage}`}
          alt="Course Preview"
          className="mb-4"
          style={{ maxWidth: "200px", maxHeight: "200px" }}
        />
      )}
      <p>
        Average Rating:{" "}
        {course.averageRating
          ? course.averageRating.toFixed(1)
          : "No ratings yet"}
      </p>

      <h2 className="text-xl font-bold mt-6">Lessons</h2>
      {isEnrolled ? (
        <Accordion type="single" collapsible className="w-full">
          {course.Lesson.map((lesson) => (
            <AccordionItem key={lesson.id} value={lesson.id}>
              <AccordionTrigger>{lesson.title}</AccordionTrigger>
              <AccordionContent>
                <p>Type: {lesson.contentType}</p>
                {lesson.TextContent.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold">Text Contents</h3>
                    {lesson.TextContent.map((content) => (
                      <div key={content.id} className="border p-2 my-2">
                        <p>{content.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                {lesson.TestContent.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold">Test Contents</h3>
                    {lesson.TestContent.map((content) => (
                      <div key={content.id} className="border p-2 my-2">
                        <p>Question: {content.question}</p>
                        <p>Options: {content.options.join(", ")}</p>
                        <p>Correct Answer: {content.correctAnswer}</p>
                      </div>
                    ))}
                  </div>
                )}
                {lesson.VideoContent.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold">Video Contents</h3>
                    {lesson.VideoContent.map((content) => (
                      <div key={content.id} className="border p-2 my-2">
                        <p>Title: {content.videoTitle}</p>
                        <p>URL: {content.url}</p>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div>
          <p>You need to enroll to see the lesson contents.</p>
          <Button onClick={handleEnroll}>Enroll</Button>
        </div>
      )}

      <h2 className="text-xl font-bold mt-6">Comments</h2>
      {course.Comment.length > 0 ? (
        course.Comment.map((comment) => (
          <div key={comment.id} className="border p-2 my-2">
            <p>{comment.content}</p>
            {comment.user && (
              <p>
                By: {comment.user.firstName} {comment.user.lastName} (
                {comment.user.email})
              </p>
            )}
            <p>At: {new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}

      <h2 className="text-xl font-bold mt-6">Ratings</h2>
      {course.Rating.length > 0 ? (
        course.Rating.map((rating) => (
          <div key={rating.id} className="border p-2 my-2">
            <p>Rating: {rating.rating}</p>
          </div>
        ))
      ) : (
        <p>No ratings yet.</p>
      )}
    </div>
  );
};

export default CourseDetails;
