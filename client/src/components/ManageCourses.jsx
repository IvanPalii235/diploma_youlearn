"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const router = useRouter();
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:4000/teacher/courses", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не вдалося отримати курси");
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Помилка при отриманні курсів:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCourses();
    } else {
      console.error("Токен не знайдено");
    }
  }, [token]);

  const handleEditCourse = (courseId) => {
    router.push(`/teacher/edit-course/${courseId}`);
  };

  const handleViewCourse = (courseId) => {
    router.push(`/teacher/course/${courseId}`);
  };

  const handleToggleActivation = async (courseId, isActive) => {
    try {
      const response = await fetch(
        `http://localhost:4000/course/${courseId}/${
          isActive ? "deactivate" : "activate"
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}), // Порожній JSON
        }
      );

      if (!response.ok) {
        throw new Error(
          `Не вдалося ${
            isActive ? "деактивувати" : "активувати"
          } курс`
        );
      }

      fetchCourses(); // Оновити список курсів
    } catch (error) {
      console.error(
        `Помилка при ${
          isActive ? "деактивації" : "активації"
        } курсу:`,
        error
      );
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:4000/course/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не вдалося видалити курс");
      }

      fetchCourses(); // Оновити список курсів
    } catch (error) {
      console.error("Помилка при видаленні курсу:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Управління курсами</h1>
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course.id} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{course.title}</h2>
                  <p>{course.description}</p>
                </div>
                <div>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleViewCourse(course.id)}
                  >
                    Переглянути
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEditCourse(course.id)}
                  >
                    Редагувати
                  </button>
                  <button
                    className={`${
                      course.isPublished
                        ? "bg-red-500 hover:bg-red-700"
                        : "bg-green-500 hover:bg-green-700"
                    } text-white font-bold py-2 px-4 rounded mr-2`}
                    onClick={() =>
                      handleToggleActivation(course.id, course.isPublished)
                    }
                  >
                    {course.isPublished ? "Деактивувати" : "Активувати"}
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    Видалити
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Немає доступних курсів</p>
      )}
    </div>
  );
};

export default ManageCourses;
