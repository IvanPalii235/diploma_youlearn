"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schemas/registerSchema";
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
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuthStore from "@/stores/authStore";

const RegisterForm = () => {
  const { setAuthStatus, setUser, setLoginSheetOpen } = useAuthStore();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const endpoint = values.role === "TEACHER" ? "teacher" : "user";
      const response = await fetch(`http://localhost:4000/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Реєстрація не вдалася");
      }

      const data = await response.json();
      document.cookie = `token=${data.token}; path=/;`;
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Реєстрація</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ім'я</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Введіть ваше ім'я"
                      {...field}
                      className="border-gray-300"
                    />
                  </FormControl>
                  <FormDescription>Введіть ваше ім'я.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Прізвище</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Введіть ваше прізвище"
                      {...field}
                      className="border-gray-300"
                    />
                  </FormControl>
                  <FormDescription>Введіть ваше прізвище.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Електронна пошта</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Введіть вашу електронну адресу"
                      {...field}
                      className="border-gray-300"
                    />
                  </FormControl>
                  <FormDescription>
                    Введіть вашу електронну адресу.
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
                      {...field}
                      className="border-gray-300"
                    />
                  </FormControl>
                  <FormDescription>Введіть ваш пароль.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Підтвердження паролю</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Підтвердіть ваш пароль"
                      {...field}
                      className="border-gray-300"
                    />
                  </FormControl>
                  <FormDescription>Підтвердіть ваш пароль.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Роль</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Виберіть роль" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">Користувач</SelectItem>
                        <SelectItem value="TEACHER">Викладач</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Виберіть вашу роль.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Зареєструватися
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
