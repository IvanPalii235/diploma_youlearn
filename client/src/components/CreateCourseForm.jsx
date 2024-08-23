"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, Controller } from "react-hook-form";
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

const CreateCourseForm = () => {
  const methods = useForm({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const [file, setFile] = useState(null);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", data.price); // Send price as a string
    if (file) formData.append("previewImage", file);

    try {
      const response = await fetch("http://localhost:4000/course", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не вдалося створити курс");
      }

      router.push("/teacher/manage-courses");
    } catch (error) {
      console.error("Помилка при створенні курсу:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Створити курс</h1>
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
                  <select {...field}>
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
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </FormControl>
          </FormItem>
          <Button type="submit">Створити курс</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateCourseForm;
