"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/authStore";

const teacherLoginSchema = z.object({
  email: z.string().email({ message: "Невірна адреса електронної пошти" }),
  password: z
    .string()
    .min(5, { message: "Пароль повинен містити принаймні 5 символів" }),
});

const TeacherLoginForm = () => {
  const { setAuthStatus, setUser } = useAuthStore();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(teacherLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await fetch("http://localhost:4000/teacher/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Не вдалося увійти");
      }

      const data = await response.json();
      document.cookie = `token=${data.token}; path=/;`;
      setAuthStatus(true);
      setUser(data.teacher);

      router.push("/teacher");
    } catch (error) {
      console.error("Помилка входу:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Вхід для викладачів
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Електронна пошта</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Введіть вашу електронну пошту"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Введіть вашу адресу електронної пошти.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Введіть ваш пароль"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Введіть ваш пароль.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Увійти як викладач
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TeacherLoginForm;
