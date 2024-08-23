"use client";

import { useState, useEffect } from "react";

const CourseStatistics = () => {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch("http://localhost:4000/teacher/statistics");
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Course Statistics</h2>
      {statistics ? (
        <div>
          <p>Total Courses: {statistics.totalCourses}</p>
          <p>Total Students: {statistics.totalStudents}</p>
          <p>Total Revenue: ${statistics.totalRevenue}</p>
        </div>
      ) : (
        <p>Loading statistics...</p>
      )}
    </div>
  );
};

export default CourseStatistics;
