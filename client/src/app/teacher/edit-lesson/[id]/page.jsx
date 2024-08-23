"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
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
  textContents: z
    .array(
      z.object({
        content: z.string().min(1, "Контент є обов'язковим"),
      })
    )
    .optional(),
  testContents: z
    .array(
      z.object({
        question: z.string().min(1, "Питання є обов'язковим"),
        options: z
          .string()
          .min(1, "Опції є обов'язковими")
          .refine(
            (val) => val.split(",").every((option) => option.trim() !== ""),
            {
              message: "Опції не можуть бути порожніми",
            }
          ),
        correctAnswer: z
          .string()
          .min(1, "Правильна відповідь є обов'язковою")
          .refine(
            (val) => !isNaN(Number(val)),
            "Правильна відповідь повинна бути числом"
          ),
      })
    )
    .optional(),
  videoContents: z
    .array(
      z.object({
        videoTitle: z.string().min(1, "Назва відео є обов'язковою"),
        url: z.string().url("URL має бути валідним"),
      })
    )
    .optional(),
});

const EditLesson = () => {
  const methods = useForm({
    resolver: zodResolver(schema),
  });
  const { fields: textContentFields, append: appendTextContent } =
    useFieldArray({
      control: methods.control,
      name: "textContents",
    });
  const { fields: testContentFields, append: appendTestContent } =
    useFieldArray({
      control: methods.control,
      name: "testContents",
    });
  const { fields: videoContentFields, append: appendVideoContent } =
    useFieldArray({
      control: methods.control,
      name: "videoContents",
    });

  const router = useRouter();
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    if (id) {
      fetchLessonDetails(id);
    }
  }, [id]);

  const fetchLessonDetails = async (lessonId) => {
    try {
      const response = await fetch(`http://localhost:4000/lesson/${lessonId}`);
      const data = await response.json();
      setLesson(data);

      methods.reset({
        title: data.title,
        textContents: data.TextContent || [],
        testContents: data.TestContent
          ? data.TestContent.map((test) => ({
              ...test,
              options: test.options.join(", "),
            }))
          : [],
        videoContents: data.VideoContent || [],
      });
    } catch (error) {
      console.error("Error fetching lesson details:", error);
    }
  };

  const onSubmit = async (data) => {
    const transformedData = {
      ...data,
      testContents: data.testContents?.map((test) => ({
        ...test,
        options: test.options.split(",").map((opt) => opt.trim()),
      })),
    };

    try {
      await fetch(`http://localhost:4000/lesson/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title: transformedData.title }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
        },
      });

      // Update or create text contents
      for (const content of transformedData.textContents) {
        await fetch(
          `http://localhost:4000/course/${lesson.courseId}/${id}/${
            content.id || ""
          }`,
          {
            method: content.id ? "PUT" : "POST",
            body: JSON.stringify({ content: content.content }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
            },
          }
        );
      }

      // Update or create test contents
      for (const content of transformedData.testContents) {
        await fetch(
          `http://localhost:4000/course/${lesson.courseId}/${id}/${
            content.id || ""
          }`,
          {
            method: content.id ? "PUT" : "POST",
            body: JSON.stringify({
              question: content.question,
              options: content.options,
              correctAnswer: content.correctAnswer,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
            },
          }
        );
      }

      // Update or create video contents
      for (const content of transformedData.videoContents) {
        await fetch(
          `http://localhost:4000/course/${lesson.courseId}/${id}/${
            content.id || ""
          }`,
          {
            method: content.id ? "PUT" : "POST",
            body: JSON.stringify({
              videoTitle: content.videoTitle,
              url: content.url,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
            },
          }
        );
      }

      router.push(`/teacher/course/${lesson.courseId}`);
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-md shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Редагувати урок</h1>
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

            {textContentFields.map((field, index) => (
              <FormField
                key={field.id}
                name={`textContents.${index}.content`}
                control={methods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Контент</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage>
                      {
                        methods.formState.errors.textContents?.[index]?.content
                          ?.message
                      }
                    </FormMessage>
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              onClick={() => appendTextContent({ content: "" })}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Додати текстовий контент
            </Button>

            {testContentFields.map((field, index) => (
              <React.Fragment key={field.id}>
                <FormField
                  name={`testContents.${index}.question`}
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Питання</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage>
                        {
                          methods.formState.errors.testContents?.[index]
                            ?.question?.message
                        }
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name={`testContents.${index}.options`}
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Опції (через кому)</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage>
                        {
                          methods.formState.errors.testContents?.[index]
                            ?.options?.message
                        }
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name={`testContents.${index}.correctAnswer`}
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Правильна відповідь (номер)</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage>
                        {
                          methods.formState.errors.testContents?.[index]
                            ?.correctAnswer?.message
                        }
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </React.Fragment>
            ))}
            <Button
              type="button"
              onClick={() =>
                appendTestContent({
                  question: "",
                  options: "",
                  correctAnswer: "",
                })
              }
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Додати тестовий контент
            </Button>

            {videoContentFields.map((field, index) => (
              <React.Fragment key={field.id}>
                <FormField
                  name={`videoContents.${index}.videoTitle`}
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Назва відео</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage>
                        {
                          methods.formState.errors.videoContents?.[index]
                            ?.videoTitle?.message
                        }
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name={`videoContents.${index}.url`}
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage>
                        {
                          methods.formState.errors.videoContents?.[index]?.url
                            ?.message
                        }
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </React.Fragment>
            ))}
            <Button
              type="button"
              onClick={() => appendVideoContent({ videoTitle: "", url: "" })}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Додати відео контент
            </Button>

            <Button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
            >
              Оновити урок
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default EditLesson;
