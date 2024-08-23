// Import necessary modules
import { useEffect } from "react";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";

const TeacherDashboard = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if user is not a teacher
    if (user?.role !== "TEACHER") {
      router.push("/login");
    }
  }, [user, router]);

  // Function to handle navigation to create course page
  const goToCreateCourse = () => {
    router.push("/teacher/create-course"); // Replace with your actual create course page route
  };

  // Function to handle navigation to manage courses page
  const goToManageCourses = () => {
    router.push("/teacher/manage-courses"); // Replace with your actual manage courses page route
  };

  // Function to handle navigation to statistics page
  const goToStatistics = () => {
    router.push("/teacher/statistics"); // Replace with your actual statistics page route
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Панель викладача</h1>
      <div className="mb-6">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
          onClick={goToCreateCourse}
        >
          Створити курс
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
          onClick={goToManageCourses}
        >
          Керувати курсами
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={goToStatistics}
        >
          Статистика
        </button>
      </div>
    </div>
  );
};

export default TeacherDashboard;
