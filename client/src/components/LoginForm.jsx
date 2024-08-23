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

const loginSchema = z.object({
  email: z.string().email({ message: "Не дійсний імейл" }),
  password: z
    .string()
    .min(5, { message: "Пароль має бути не менше 5 символів" }),
});

const LoginForm = () => {
  const { setAuthStatus, setUser } = useAuthStore();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await fetch("http://localhost:4000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      document.cookie = `token=${data.token}; path=/;`;
      setAuthStatus(true);
      setUser(data.user);

      // Redirect based on role
      if (data.user.role === "TEACHER") {
        router.push("/teacher-dashboard");
      } else {
        router.push("/courses");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пошта</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Введіть пошту" {...field} />
              </FormControl>
              <FormDescription>Введіть пошту.</FormDescription>
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
                  placeholder="Введіть пароль"
                  {...field}
                />
              </FormControl>
              <FormDescription>Введіть пароль.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Увійти</Button>
      </form>
    </Form>
  );
};

export default LoginForm;
