"use client";

import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import TeacherLoginForm from "@/components/TeacherLoginForm";

const LoginSwitcher = () => {
  const [isTeacherLogin, setIsTeacherLogin] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 ${
            !isTeacherLogin ? "bg-gray-200" : "bg-gray-100"
          }`}
          onClick={() => setIsTeacherLogin(false)}
        >
          Увійти як користувач
        </button>
        <button
          className={`px-4 py-2 ${
            isTeacherLogin ? "bg-gray-200" : "bg-gray-100"
          }`}
          onClick={() => setIsTeacherLogin(true)}
        >
          Увійти як викладач
        </button>
      </div>
      {isTeacherLogin ? <TeacherLoginForm /> : <LoginForm />}
    </div>
  );
};

export default LoginSwitcher;
