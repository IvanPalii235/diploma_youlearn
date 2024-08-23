"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const VideoTask = () => {
  const router = useRouter();
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (id) {
      fetchTaskDetails(id);
    }
  }, [id]);

  const fetchTaskDetails = async (taskId) => {
    try {
      const token = document.cookie.split("token=")[1];
      const response = await fetch(
        `http://localhost:4000/lesson/${taskId}/video-task`,
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
    }
  };

  if (!task) return <p>Завантаження...</p>;

  const youtubeEmbedUrl = task.url.replace("watch?v=", "embed/");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-md shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Відео Завдання</h1>
        <div className="mb-6">
          <iframe
            src={youtubeEmbedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-96 rounded-md shadow-md" // Higher height set here
          ></iframe>
        </div>
        <Button
          onClick={() => router.back()}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Назад до курсу
        </Button>
      </div>
    </div>
  );
};

export default VideoTask;
