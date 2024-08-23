"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const TextTask = () => {
  const router = useRouter();
  const { id: lessonId } = useParams(); // This id should be the lessonId
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lessonId) {
      fetchTaskDetails(lessonId); // Pass lessonId to fetch task details
    }
  }, [lessonId]);

  const fetchTaskDetails = async (lessonId) => {
    try {
      const token = document.cookie.split("token=")[1];
      const response = await fetch(
        `http://localhost:4000/lesson/${lessonId}/text-task`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error fetching task details: ${response.statusText}`);
      }
      const data = await response.json();
      setTask(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-md shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Текстове завдання</h1>
        <p className="mb-6">{task.content}</p>
        <Button onClick={() => router.back()} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
          Назад до курсу
        </Button>
      </div>
    </div>
  );
};

export default TextTask;
