"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

const RatingsSection = ({ courseId }) => {
  const [ratings, setRatings] = useState([]);
  const [newRating, setNewRating] = useState(0);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/courses/${courseId}/ratings`
        );
        if (!res.ok) {
          throw new Error("Не вдалося отримати оцінки");
        }
        const ratingsData = await res.json();
        setRatings(ratingsData);
      } catch (error) {
        console.error("Помилка при отриманні оцінок:", error);
      }
    };

    fetchRatings();
  }, [courseId]);

  const handleAddRating = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/courses/${courseId}/ratings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
          },
          body: JSON.stringify({ rating: newRating, courseId }), // Ensure courseId is included
        }
      );
      if (!res.ok) {
        throw new Error("Не вдалося додати оцінку");
      }
      const rating = await res.json();
      setRatings((prevRatings) => [...prevRatings, rating]);
      setNewRating(0);
    } catch (error) {
      console.error("Помилка при додаванні оцінки:", error);
    }
  };

  return (
    <div>
      <h3>Додати оцінку:</h3>
      <input
        type="number"
        value={newRating}
        onChange={(e) => setNewRating(Number(e.target.value))}
        min="0"
        max="5"
      />
      <Button onClick={handleAddRating}>Додати оцінку</Button>
      <div>
        <h3>Оцінки:</h3>
        {ratings.map((rating) => (
          <div key={rating.id}>
            <p>Оцінка: {rating.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingsSection;
