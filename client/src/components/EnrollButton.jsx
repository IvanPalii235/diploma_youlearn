"use client";

import React from "react";
import { Button } from "./ui/button";

const EnrollButton = ({ courseId, setIsEnrolled }) => {
  const handleEnroll = async () => {
    try {
      const res = await fetch(`http://localhost:4000/course/${courseId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${document.cookie.split('token=')[1]}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to enroll");
      }
      await res.json();
      setIsEnrolled(true);
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  return (
    <Button className="my-2 w-full" onClick={handleEnroll}>
      Enroll
    </Button>
  );
};

export default EnrollButton;
