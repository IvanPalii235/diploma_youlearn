import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import useAuthStore from "@/stores/authStore";

const TeacherCoursePage = () => {
  const router = useRouter();
  const { id: courseId } = useParams();
  const { user } = useAuthStore();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/course/${courseId}`
        );
        if (!response.ok) {
          throw new Error("Не вдалося завантажити курс");
        }
        const courseData = await response.json();
        setCourse(courseData);
      } catch (error) {
        console.error("Помилка завантаження курсу:", error);
      }
    };

    if (user?.role === "TEACHER") {
      fetchCourse();
    } else {
      router.push("/login");
    }
  }, [courseId, user, router]);

  const goToCreateLesson = () => {
    router.push(`/teacher/course/${courseId}/create-lesson`);
  };

  if (!course) {
    return <p>Завантаження...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
      <Button onClick={goToCreateLesson}>Додати урок</Button>
      <div>
        {course.Lesson.map((lesson) => (
          <div key={lesson.id}>
            <h2>{lesson.title}</h2>
            <Link href={`/teacher/course/${courseId}/lesson/${lesson.id}/edit`}>
              <a>Редагувати урок</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCoursePage;
