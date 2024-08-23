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
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonContentType, setNewLessonContentType] = useState("TEXT");
  const [newTextContent, setNewTextContent] = useState("");
  const [newTestQuestion, setNewTestQuestion] = useState("");
  const [newTestOptions, setNewTestOptions] = useState("");
  const [newTestCorrectAnswer, setNewTestCorrectAnswer] = useState("");
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");

  useEffect(() => {
    if (id) {
      fetchCourseDetails(id);
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

  const handleEditLesson = (lessonId) => {
    router.push(`/teacher/edit-lesson/${lessonId}`);
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      const response = await fetch(`http://localhost:4000/lesson/${lessonId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete lesson");
      }

      setCourse((prevCourse) => ({
        ...prevCourse,
        Lesson: prevCourse.Lesson.filter((lesson) => lesson.id !== lessonId),
      }));
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  };

  const handleDeleteTask = async (lessonId, taskId, taskType) => {
    try {
      const response = await fetch(
        `http://localhost:4000/lesson/${lessonId}/${taskType}/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setCourse((prevCourse) => ({
        ...prevCourse,
        Lesson: prevCourse.Lesson.map((lesson) => {
          if (lesson.id === lessonId) {
            return {
              ...lesson,
              [`${taskType}Content`]: lesson[`${taskType}Content`]
                ? lesson[`${taskType}Content`].filter(
                    (task) => task.id !== taskId
                  )
                : [],
            };
          }
          return lesson;
        }),
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddLesson = async () => {
    let content = "";
    if (newLessonContentType === "TEXT") {
      content = newTextContent;
    } else if (newLessonContentType === "TEST") {
      content = {
        question: newTestQuestion,
        options: newTestOptions.split(",").map((opt) => opt.trim()),
        correctAnswer: parseInt(newTestCorrectAnswer, 10),
      };
    } else if (newLessonContentType === "VIDEO") {
      content = {
        videoTitle: newVideoTitle,
        url: newVideoUrl,
      };
    }

    try {
      const response = await fetch(
        `http://localhost:4000/course/${id}/lesson`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
          },
          body: JSON.stringify({
            title: newLessonTitle,
            contentType: newLessonContentType,
            content: content,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add lesson");
      }

      const newLesson = await response.json();
      setCourse((prevCourse) => ({
        ...prevCourse,
        Lesson: [...prevCourse.Lesson, newLesson],
      }));
      setNewLessonTitle("");
      setNewTextContent("");
      setNewTestQuestion("");
      setNewTestOptions("");
      setNewTestCorrectAnswer("");
      setNewVideoTitle("");
      setNewVideoUrl("");
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  if (!course) return <p>Завантаження...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-md shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
        <p className="mb-2">{course.description}</p>
        <p className="mb-2">Категорія: {course.category}</p>
        <p className="mb-2">Ціна: {course.price}</p>
        <p className="mb-2">
          Викладач: {course.teacherName} {course.teacherLName} (
          {course.teacher.email})
        </p>
        {course.previewImage && (
          <img
            src={`http://localhost:4000/uploads/${course.previewImage}`}
            alt="Попередній перегляд курсу"
            className="mb-4 rounded-md"
            style={{ maxWidth: "300px", maxHeight: "300px" }}
          />
        )}
        <p className="mb-6">
          Середня оцінка:{" "}
          {course.averageRating
            ? course.averageRating.toFixed(1)
            : "Ще немає оцінок"}
        </p>

        <h2 className="text-xl font-bold mb-4">Уроки</h2>
        <Accordion type="single" collapsible className="w-full mb-6">
          {course.Lesson.length > 0 ? (
            course.Lesson.map((lesson) => (
              <AccordionItem key={lesson.id} value={lesson.id}>
                <AccordionTrigger>{lesson.title}</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Тип: {lesson.contentType}</p>
                  {lesson.TextContent?.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-bold mb-2">Текстовий вміст</h3>
                      {lesson.TextContent.map((content) => (
                        <div
                          key={content.id}
                          className="border p-2 my-2 rounded-md"
                        >
                          <p>{content.content}</p>
                          <Button
                            onClick={() =>
                              handleDeleteTask(lesson.id, content.id, "text")
                            }
                            className="mt-2 bg-red-500 text-white"
                          >
                            Видалити текст
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  {lesson.TestContent?.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-bold mb-2">Тестовий вміст</h3>
                      {lesson.TestContent.map((content) => (
                        <div
                          key={content.id}
                          className="border p-2 my-2 rounded-md"
                        >
                          <p>Запитання: {content.question}</p>
                          <p>Варіанти: {content.options.join(", ")}</p>
                          <p>Правильна відповідь: {content.correctAnswer}</p>
                          <Button
                            onClick={() =>
                              handleDeleteTask(lesson.id, content.id, "test")
                            }
                            className="mt-2 bg-red-500 text-white"
                          >
                            Видалити тест
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  {lesson.VideoContent?.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-bold mb-2">Відео вміст</h3>
                      {lesson.VideoContent.map((content) => (
                        <div
                          key={content.id}
                          className="border p-2 my-2 rounded-md"
                        >
                          <p>Назва: {content.videoTitle}</p>
                          <p>URL: {content.url}</p>
                          <Button
                            onClick={() =>
                              handleDeleteTask(lesson.id, content.id, "video")
                            }
                            className="mt-2 bg-red-500 text-white"
                          >
                            Видалити відео
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    onClick={() => handleEditLesson(lesson.id)}
                    className="mr-2 bg-yellow-500 text-white"
                  >
                    Редагувати урок
                  </Button>
                  <Button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="bg-red-500 text-white"
                  >
                    Видалити урок
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))
          ) : (
            <div>
              <p>Ще немає уроків. Ви можете додати урок нижче.</p>
            </div>
          )}
        </Accordion>

        <h2 className="text-xl font-bold mb-4">Додати новий урок</h2>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Назва уроку"
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
            className="mb-2"
          />
          <select
            value={newLessonContentType}
            onChange={(e) => setNewLessonContentType(e.target.value)}
            className="mb-2 p-2 border rounded w-full"
          >
            <option value="TEXT">Текст</option>
            <option value="TEST">Тест</option>
            <option value="VIDEO">Відео</option>
          </select>
          {newLessonContentType === "TEXT" && (
            <Input
              type="text"
              placeholder="Текстовий вміст"
              value={newTextContent}
              onChange={(e) => setNewTextContent(e.target.value)}
              className="mb-2"
            />
          )}
          {newLessonContentType === "TEST" && (
            <>
              <Input
                type="text"
                placeholder="Запитання для тесту"
                value={newTestQuestion}
                onChange={(e) => setNewTestQuestion(e.target.value)}
                className="mb-2"
              />
              <Input
                type="text"
                placeholder="Варіанти (через кому)"
                value={newTestOptions}
                onChange={(e) => setNewTestOptions(e.target.value)}
                className="mb-2"
              />
              <Input
                type="text"
                placeholder="Правильна відповідь"
                value={newTestCorrectAnswer}
                onChange={(e) => setNewTestCorrectAnswer(e.target.value)}
                className="mb-2"
              />
            </>
          )}
          {newLessonContentType === "VIDEO" && (
            <>
              <Input
                type="text"
                placeholder="Назва відео"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                className="mb-2"
              />
              <Input
                type="text"
                placeholder="URL відео"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className="mb-2"
              />
            </>
          )}
          <Button onClick={handleAddLesson} className="bg-green-500 text-white">
            Додати урок
          </Button>
        </div>

        <h2 className="text-xl font-bold mb-4">Коментарі</h2>
        {course.Comment.length > 0 ? (
          course.Comment.map((comment) => (
            <div key={comment.id} className="border p-2 my-2 rounded-md">
              <p>{comment.content}</p>
              {comment.user && (
                <p>
                  Від: {comment.user.firstName} {comment.user.lastName} (
                  {comment.user.email})
                </p>
              )}
              <p>Дата: {new Date(comment.createdAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>Ще немає коментарів.</p>
        )}

        <h2 className="text-xl font-bold mb-4">Оцінки</h2>
        {course.Rating.length > 0 ? (
          course.Rating.map((rating) => (
            <div key={rating.id} className="border p-2 my-2 rounded-md">
              <p>Оцінка: {rating.rating}</p>
            </div>
          ))
        ) : (
          <p>Ще немає оцінок.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
