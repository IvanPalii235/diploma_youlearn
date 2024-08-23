"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/authStore";

const NavBar = () => {
  const { isAuthenticated, setAuthStatus, user, setUser, logout } =
    useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) {
      setAuthStatus(true);
      fetchUserDetails(token);
    } else {
      setAuthStatus(false);
      setLoading(false);
    }
  }, [setAuthStatus]);

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch(`http://localhost:4000/auth/verify-token`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не вдалося отримати дані користувача");
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Помилка при отриманні даних користувача:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const url = user?.role === "TEACHER" ? "/teacher/logout" : "/user/logout";
      const response = await fetch(`http://localhost:4000${url}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не вдалося вийти з системи");
      }

      document.cookie = "token=; Max-Age=0; path=/;";
      logout();
      router.push("/login");
    } catch (error) {
      console.error("Помилка при виході з системи:", error);
    }
  };

  if (loading) {
    return <div>Завантаження...</div>;
  }

  return (
    <div className="  ">
      <Menubar className="p-4 h-16">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MenubarMenu>
              <MenubarTrigger className="text-lg font-light m-3 hover:text-blue-300">
                <a href="/">ГОЛОВНА</a>
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="text-lg font-light m-3 hover:text-blue-300">
                <a href="/courses">КУРСИ</a>
              </MenubarTrigger>
            </MenubarMenu>
          </div>
          <div className="font-bold font-mono text-4xl  px-10">
            <h1 className="text-center">
              <a href="/">YOULEARN</a>
            </h1>
          </div>
          <div className="flex items-center">
            <MenubarMenu>
              <MenubarTrigger className="text-lg font-light m-3 hover:text-blue-300">
                <a href="/about">ПРО НАС</a>
              </MenubarTrigger>
            </MenubarMenu>
            {isAuthenticated ? (
              <>
                {user?.role !== "TEACHER" && (
                  <MenubarMenu>
                    <MenubarTrigger className="text-lg font-light m-3 hover:text-blue-300">
                      ПРОФІЛЬ
                    </MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem disabled>
                        {user?.firstName || "ІМ'Я ПРОФІЛЮ"}
                      </MenubarItem>
                      <Separator />
                      <MenubarItem>
                        <a href="/user">МІЙ ПРОФІЛЬ</a>
                      </MenubarItem>
                      <MenubarItem>
                        <a href="/user/settings">НАЛАШТУВАННЯ</a>
                      </MenubarItem>
                      <MenubarItem onClick={handleLogout}>ВИЙТИ</MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                )}
                {user?.role === "TEACHER" && (
                  <MenubarMenu>
                    <MenubarTrigger className="text-lg font-light m-3 hover:text-blue-300">
                      ВИКЛАДАЧ
                    </MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem>
                        <a href="/teacher">Кабінет викладача</a>
                      </MenubarItem>
                      <MenubarItem onClick={handleLogout}>ВИЙТИ</MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                )}
              </>
            ) : (
              <>
                <MenubarMenu>
                  <MenubarTrigger className="text-lg font-light m-3 hover:text-blue-300">
                    <a href="/login">УВІЙТИ</a>
                  </MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger className="text-lg font-light m-3 hover:text-blue-300">
                    <a href="/register">РЕЄСТРАЦІЯ</a>
                  </MenubarTrigger>
                </MenubarMenu>
              </>
            )}
          </div>
        </div>
      </Menubar>
    </div>
  );
};

export default NavBar;
