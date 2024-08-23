"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuthCheck from "@/hooks/useAuthCheck";
import { Label } from "@/components/ui/label";

// Define the Zod schema for the user settings form
const userSettingsSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  email: z
    .string()
    .email("Invalid email address")
    .max(100, "Email is too long"),
});

const Settings = () => {
  const { user, authLoading } = useAuthCheck();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
    } else {
      fetchUserData();
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
    }
  }, [user, authLoading, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/profile", {
        headers: {
          Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      // Validate the form inputs
      userSettingsSchema.parse({ firstName, lastName, email });

      setLoading(true);

      const response = await fetch("http://localhost:4000/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
        },
        body: JSON.stringify({ firstName, lastName, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user information");
      }

      // Optionally, fetch the updated user data to reflect changes
      await fetchUserData();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error("Error updating user information:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <p>Завантаження...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-md shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Налаштування</h1>
        <div>
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700">
              Ім'я
            </Label>
            <Input
              placeholder="Ім'я"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              maxLength={50}
            />
            {errors.firstName && (
              <p className="text-red-500">{errors.firstName}</p>
            )}
          </div>
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700">
              Прізвище
            </Label>
            <Input
              placeholder="Прізвище"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              maxLength={50}
            />
            {errors.lastName && (
              <p className="text-red-500">{errors.lastName}</p>
            )}
          </div>
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              maxLength={100}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <Button
            onClick={handleUpdate}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Оновлення..." : "Оновити інформацію"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
