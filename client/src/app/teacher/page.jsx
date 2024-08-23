"use client";

import dynamic from "next/dynamic";
import useAuthCheck from "@/hooks/useAuthCheck";

// Dynamically import the TeacherDashboard component
const TeacherDashboard = dynamic(
  () => import("@/components/TeacherDashboard"),
  {
    ssr: false,
  }
);

const TeacherDashboardPage = () => {
  const { user } = useAuthCheck();

  if (!user || user.role !== "TEACHER") {
    return null; // Show nothing or a loading spinner while redirecting
  }

  return <TeacherDashboard />;
};

export default TeacherDashboardPage;
