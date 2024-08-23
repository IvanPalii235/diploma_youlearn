import React from "react";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";

const fetchCourses = async () => {
  const res = await fetch("http://localhost:4000/course", {
    cache: "no-store",
  }); // Ensure fresh data
  if (!res.ok) {
    throw new Error("Не вдалося завантажити курси");
  }
  const courses = await res.json();
  return courses;
};

const CoursesPage = async () => {
  const courses = await fetchCourses();

  return (
    <div>
      {courses.length === 0 ? (
        <p>Курси не знайдені!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 justify-items-center">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
                <CourseCard
                  title={course.title}
                  category={course.category}
                  price={course.price}
                  previewImage={course.previewImage}
                  teacherName={course.teacherName}
                  teacherLName={course.teacherLName}
                  createdAt={course.createdAt}
                />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
