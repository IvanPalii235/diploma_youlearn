"use client";

import TeacherLoginForm from "@/components/TeacherLoginForm";

const TeacherLoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-md shadow-md">
        <TeacherLoginForm />
      </div>
    </div>
  );
};

export default TeacherLoginPage;
