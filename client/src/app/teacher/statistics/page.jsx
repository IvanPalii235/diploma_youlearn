"use client";

import React, { useEffect, useState } from "react";

const TeacherDashboard = () => {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch("http://localhost:4000/teacher/statistics", {
        headers: {
          Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  if (!statistics) return <p>Завантаження...</p>;

return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="p-8 bg-white rounded-md shadow-lg w-full max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Панель викладача</h1>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Статистика</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-md shadow-sm">
            <p className="font-semibold">Загальна кількість курсів</p>
            <p>{statistics.totalCourses}</p>
          </div>
          <div className="p-4 border rounded-md shadow-sm">
            <p className="font-semibold">Загальна кількість уроків</p>
            <p>{statistics.totalLessons}</p>
          </div>
          <div className="p-4 border rounded-md shadow-sm">
            <p className="font-semibold">Загальна кількість записів</p>
            <p>{statistics.totalEnrollments}</p>
          </div>
          <div className="p-4 border rounded-md shadow-sm">
            <p className="font-semibold">Загальна кількість коментарів</p>
            <p>{statistics.totalComments}</p>
          </div>
          <div className="p-4 border rounded-md shadow-sm">
            <p className="font-semibold">Загальна кількість оцінок</p>
            <p>{statistics.totalRatings}</p>
          </div>
          <div className="p-4 border rounded-md shadow-sm">
            <p className="font-semibold">Середня оцінка курсу</p>
            <p>{statistics.averageRating}</p>
          </div>
          <div className="p-4 border rounded-md shadow-sm col-span-2">
            <p className="font-semibold">Загальний дохід</p>
            <p>${statistics.totalEarnings}</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Платежі</h2>
        {statistics.payments.map((payment) => (
          <div key={payment.id} className="border p-4 mb-4 rounded-md shadow-sm">
            <p className="font-semibold">Курс: {payment.courseTitle}</p>
            <p>Сума: ${payment.amount}</p>
            <p>Дата: {new Date(payment.createdAt).toLocaleDateString()}</p>
            <p>Статус: {payment.status}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

};

export default TeacherDashboard;
