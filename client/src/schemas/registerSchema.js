import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, { message: "Ім'я повинно містити щонайменше 2 символи" }),
  lastName: z.string().min(2, { message: "Прізвище повинно містити щонайменше 2 символи" }),
  email: z.string().email({ message: "Недійсна електронна адреса" }),
  password: z.string().min(5, { message: "Пароль повинен містити щонайменше 5 символів" }),
  confirmPassword: z.string().min(5, { message: "Пароль підтвердження повинен містити щонайменше 5 символів" }),
  role: z.enum(["USER", "TEACHER"], { message: "Виберіть дійсну роль" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Паролі не співпадають",
  path: ["confirmPassword"],
});
