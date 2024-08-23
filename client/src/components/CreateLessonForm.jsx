"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
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
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["DEVELOPMENT", "MANAGING", "ART"]),
  price: z.string(), // No validation, just treat as string
});

const CreateCourseForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const [file, setFile] = useState(null);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", parseFloat(data.price)); // Parse as number before submitting
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
        throw new Error("Failed to create course");
      }

      router.push("/teacher/manage-courses");
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Course</h1>
      <Form>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FormField control={control} name="title">
            {({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                {errors.title && (
                  <FormMessage>{errors.title.message}</FormMessage>
                )}
              </FormItem>
            )}
          </FormField>
          <FormField control={control} name="description">
            {({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                {errors.description && (
                  <FormMessage>{errors.description.message}</FormMessage>
                )}
              </FormItem>
            )}
          </FormField>
          <FormField control={control} name="category">
            {({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <select {...field}>
                    <option value="DEVELOPMENT">Development</option>
                    <option value="MANAGING">Managing</option>
                    <option value="ART">Art</option>
                  </select>
                </FormControl>
                {errors.category && (
                  <FormMessage>{errors.category.message}</FormMessage>
                )}
              </FormItem>
            )}
          </FormField>
          <FormField control={control} name="price">
            {({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                {errors.price && (
                  <FormMessage>{errors.price.message}</FormMessage>
                )}
              </FormItem>
            )}
          </FormField>
          <FormItem>
            <FormLabel>Preview Image</FormLabel>
            <FormControl>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </FormControl>
          </FormItem>
          <Button type="submit">Create Course</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourseForm;
