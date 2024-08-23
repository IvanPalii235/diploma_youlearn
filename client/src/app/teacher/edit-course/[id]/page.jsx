"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

const schema = z.object({
  title: z.string().min(1, "Назва є обов'язковою"),
  description: z.string().min(1, "Опис є обов'язковим"),
  category: z.enum(["DEVELOPMENT", "MANAGING", "ART"], {
    required_error: "Категорія є обов'язковою",
  }),
  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Ціна повинна бути позитивним числом",
    }),
});

const EditCourse = () => {
  const methods = useForm({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [currentPreviewImage, setCurrentPreviewImage] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCourseDetails(id);
    }
  }, [id]);

  const fetchCourseDetails = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:4000/course/${courseId}`);
      const data = await response.json();
      methods.reset(data);
      setCurrentPreviewImage(data.previewImage); // Set current preview image
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", data.price); // Keep price as string
    if (file) formData.append("previewImage", file);

    console.log("Submitting form data:", data);

    try {
      const response = await fetch(`http://localhost:4000/course/${id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не вдалося оновити курс");
      }

      const responseData = await response.json();
      console.log("Response from server:", responseData);
      router.push("/teacher/manage-courses");
    } catch (error) {
      console.error("Помилка при оновленні курсу:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-md shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Редагувати курс</h1>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="title"
              control={methods.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage>
                    {methods.formState.errors.title?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={methods.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Опис</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage>
                    {methods.formState.errors.description?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="category"
              control={methods.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категорія</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full p-2 border rounded mb-2"
                    >
                      <option value="DEVELOPMENT">Розробка</option>
                      <option value="MANAGING">Управління</option>
                      <option value="ART">Мистецтво</option>
                    </select>
                  </FormControl>
                  <FormMessage>
                    {methods.formState.errors.category?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="price"
              control={methods.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ціна</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage>
                    {methods.formState.errors.price?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Попереднє зображення</FormLabel>
              <FormControl>
                <>
                  {currentPreviewImage && (
                    <img
                      src={`http://localhost:4000/uploads/${currentPreviewImage}`}
                      alt="Preview"
                      className="mb-4 rounded-md"
                      style={{ maxWidth: "300px", maxHeight: "300px" }}
                    />
                  )}
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full p-2 border rounded mb-2"
                  />
                </>
              </FormControl>
            </FormItem>
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Оновити курс
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default EditCourse;
