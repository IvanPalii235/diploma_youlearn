"use client";

import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-md shadow-lg space-y-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800">Вхід</h1>
        <Link
          href="/user/login"
          passHref
          className="block w-full py-2 px-4 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Увійти як Користувач
        </Link>
        <Link
          href="/teacher/login"
          passHref
          className="block w-full py-2 px-4 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Увійти як Вчитель
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
