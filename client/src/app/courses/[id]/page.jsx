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

const CourseDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState({});

  useEffect(() => {
    if (id) {
      fetchCourseDetails(id);
      checkEnrollment(id);
      fetchComments(id);
      fetchRatings(id);
    }
  }, [id]);

  const fetchCourseDetails = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:4000/course/${courseId}`);
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error("Помилка при отриманні деталей курсу:", error);
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
      const data = await response.json();

      setIsEnrolled(data.enrolled);
    } catch (error) {
      console.error("Помилка перевірки реєстрації:", error);
      setIsEnrolled(false);
    }
  };

  const fetchComments = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/course/${courseId}/comments`
      );
      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Помилка отримання коментарів:", error);
      setComments([]);
    }
  };

  const fetchRatings = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/courses/${courseId}/ratings`
      );
      const data = await response.json();
      setRatings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Помилка отримання оцінок:", error);
      setRatings([]);
    }
  };

  const handleEnroll = async () => {
    router.push(`/checkout?courseId=${id}`);
  };

  const handleLeaveCourse = async () => {
    try {
      const response = await fetch(`http://localhost:4000/course/${id}/leave`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не вдалося покинути курс");
      }

      setIsEnrolled(false);
      fetchCourseDetails(id); // Оновити деталі курсу
    } catch (error) {
      console.error("Помилка при покиданні курсу:", error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/course/${id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (!response.ok) {
        throw new Error("Не вдалося додати коментар");
      }

      setNewComment("");
      fetchComments(id); // Оновити коментарі
    } catch (error) {
      console.error("Помилка при додаванні коментаря:", error);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/courses/${id}/ratings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
          },
          body: JSON.stringify({ rating, courseId: id }),
        }
      );

      if (!response.ok) {
        throw new Error("Не вдалося додати оцінку");
      }

      setRating(0);
      fetchRatings(id); // Оновити оцінки
      fetchCourseDetails(id); // Оновити деталі курсу
    } catch (error) {
      console.error("Помилка при додаванні оцінки:", error);
    }
  };

  const handleAnswerSubmit = async (lessonId, taskId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/lessons/${lessonId}/TEST/${taskId}/check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
          },
          body: JSON.stringify({ selectedOption }),
        }
      );

      const result = await response.json();

      setCorrectAnswers((prevAnswers) => ({
        ...prevAnswers,
        [taskId]: result.isCorrect,
      }));
    } catch (error) {
      console.error("Помилка при перевірці відповіді:", error);
    }
  };

  if (!course) return <p>Завантаження...</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">{course.title}</h1>
      <p className="mb-4">{course.description}</p>
      <p className="mb-2">
        <strong>Категорія:</strong> {course.category}
      </p>
      <p className="mb-2">
        <strong>Ціна:</strong> {course.price}
      </p>
      <p className="mb-4">
        <strong>Викладач:</strong> {course.teacherName} {course.teacherLName} (
        {course.teacher.email})
      </p>
      {course.previewImage && (
        <div className="mb-4 flex justify-center">
          <img
            src={`http://localhost:4000/uploads/${course.previewImage}`}
            alt="Попередній перегляд курсу"
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>
      )}
      <p className="mb-6 text-center text-lg">
        <strong>Середня оцінка:</strong>{" "}
        {course.averageRating
          ? course.averageRating.toFixed(1)
          : "Ще немає оцінок"}
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Уроки</h2>
      {isEnrolled ? (
        <Accordion type="single" collapsible className="w-full">
          {course.Lesson.map((lesson) => (
            <AccordionItem key={lesson.id} value={lesson.id}>
              <AccordionTrigger>{lesson.title}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  <strong>Тип:</strong> {lesson.contentType}
                </p>
                {lesson.TextContent.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold mb-2">Текстовий вміст</h3>
                    {lesson.TextContent.map((content) => (
                      <div
                        key={content.id}
                        className="border p-4 mb-2 rounded-lg shadow-sm"
                      >
                        <p className="mb-2">{content.content}</p>
                        <Button
                          onClick={() =>
                            router.push(`/lesson/${lesson.id}/text-task`)
                          }
                          className="bg-blue-500"
                        >
                          Відкрити завдання
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {lesson.TestContent.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold mb-2">Тестовий вміст</h3>
                    {lesson.TestContent.map((content) => (
                      <div
                        key={content.id}
                        className="border p-4 mb-2 rounded-lg shadow-sm"
                      >
                        <p className="mb-2">
                          <strong>Запитання:</strong> {content.question}
                        </p>
                        {content.options.map((option, index) => (
                          <label key={index} className="block mb-1">
                            <input
                              type="radio"
                              name={`option-${content.id}`}
                              value={index}
                              onChange={() => setSelectedOption(index)}
                              className="mr-2"
                            />
                            {option}
                          </label>
                        ))}
                        <Button
                          onClick={() =>
                            handleAnswerSubmit(lesson.id, content.id)
                          }
                          className="bg-blue-500 mt-2"
                        >
                          Надіслати відповідь
                        </Button>
                        {correctAnswers[content.id] !== undefined && (
                          <p>
                            {correctAnswers[content.id]
                              ? "Правильна відповідь"
                              : "Неправильна відповідь"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {lesson.VideoContent.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold mb-2">Відео вміст</h3>
                    {lesson.VideoContent.map((content) => (
                      <div
                        key={content.id}
                        className="border p-4 mb-2 rounded-lg shadow-sm"
                      >
                        <p>{content.videoTitle}</p>
                        <Button
                          onClick={() =>
                            router.push(`/lesson/${lesson.id}/video-task`)
                          }
                          className="bg-blue-500"
                        >
                          Відкрити завдання
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center">
          <p className="mb-4">
            Вам потрібно купити цей курс, щоб побачити вміст уроків.
          </p>
          <Button onClick={handleEnroll} className="bg-blue-500">
            Купити курс
          </Button>
        </div>
      )}

      {isEnrolled && (
        <div>
          <Button onClick={handleLeaveCourse} className="bg-red-500 my-4">
            Покинути курс
          </Button>

          <h2 className="text-2xl font-bold mt-8 mb-4">Коментарі</h2>
          <div>
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="border p-4 mb-2 rounded-lg shadow-sm"
              >
                <p>{comment.content}</p>
                <p className="text-gray-500">
                  Від: {comment.user.firstName} {comment.user.lastName}
                </p>
              </div>
            ))}
            <div className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Додати коментар"
                className="w-full p-4 border rounded-lg shadow-sm"
              />
              <Button
                onClick={handleCommentSubmit}
                className="mt-2 bg-blue-500"
              >
                Надіслати коментар
              </Button>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Оцініть цей курс</h2>
          <div>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              min="1"
              max="5"
              className="w-full p-4 border rounded-lg shadow-sm"
            />
            <Button onClick={handleRatingSubmit} className="mt-2 bg-blue-500">
              Надіслати оцінку
            </Button>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Всі оцінки</h2>
          <div>
            {ratings.map((rate) => (
              <div
                key={rate.id}
                className="border p-4 mb-2 rounded-lg shadow-sm"
              >
                <p>Оцінка: {rate.rating}</p>
                <p className="text-gray-500">
                  Від: {rate.enrollment.user.firstName}{" "}
                  {rate.enrollment.user.lastName}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
