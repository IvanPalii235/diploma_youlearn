"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthCheck from "@/hooks/useAuthCheck";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user, authLoading } = useAuthCheck();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);
  const [editingRating, setEditingRating] = useState(null);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [newRatingValue, setNewRatingValue] = useState(0);

  useEffect(() => {
    if (authLoading) {
      console.log("Auth is loading...");
      return;
    }

    if (!user) {
      router.push("/login");
    } else {
      fetchUserData();
      fetchUserEnrolledCourses();
      fetchUserComments();
      fetchUserRatings();
    }
  }, [user, authLoading, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/profile", {
        headers: {
          Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEnrolledCourses = async () => {
    try {
      const response = await fetch("http://localhost:4000/course/enrolled", {
        headers: {
          Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch enrolled courses");
      }

      const data = await response.json();
      setEnrolledCourses(data);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  const fetchUserComments = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/comments", {
        headers: {
          Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user comments");
      }

      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching user comments:", error);
    }
  };

  const fetchUserRatings = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/ratings", {
        headers: {
          Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user ratings");
      }

      const data = await response.json();
      setRatings(data);
    } catch (error) {
      console.error("Error fetching user ratings:", error);
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/course/${courseId}/leave`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unenroll from course");
      }

      fetchUserEnrolledCourses();
    } catch (error) {
      console.error("Error unenrolling from course:", error);
    }
  };

  const redirectToCourse = (courseId) => {
    router.push(`/courses/${courseId}`);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/course/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      fetchUserComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDeleteRating = async (ratingId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/user/ratings/${ratingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete rating");
      }

      fetchUserRatings();
    } catch (error) {
      console.error("Error deleting rating:", error);
    }
  };

  const handleEditComment = (comment) => {
    console.log("Editing comment:", comment);
    setEditingComment(comment);
    setNewCommentContent(comment.content);
  };

  const handleEditRating = (rating) => {
    console.log("Editing rating:", rating);
    setEditingRating(rating);
    setNewRatingValue(rating.rating);
  };

  const handleUpdateComment = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/course/comment/${editingComment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
          },
          body: JSON.stringify({ content: newCommentContent }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      setEditingComment(null);
      setNewCommentContent("");
      fetchUserComments(); // Refresh comments
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleUpdateRating = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/user/ratings/${editingRating.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
          },
          body: JSON.stringify({ rating: newRatingValue }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update rating");
      }

      setEditingRating(null);
      setNewRatingValue(0);
      fetchUserRatings(); // Refresh ratings
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  if (authLoading || loading) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-md shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Профіль</h1>
        {userData ? (
          <div>
            <div className="mb-6">
              <p>
                <strong>Ім'я:</strong> {userData.firstName}
              </p>
              <p>
                <strong>Прізвище:</strong> {userData.lastName}
              </p>
              <p>
                <strong>Електронна пошта:</strong> {userData.email}
              </p>
              <p>
                <strong>Роль:</strong> {userData.role}
              </p>
            </div>

            <h2 className="text-xl font-bold mt-6">Записані курси</h2>
            {enrolledCourses.length > 0 ? (
              <ul>
                {enrolledCourses.map((enrollment) => (
                  <li
                    key={enrollment.course.id}
                    className="border p-4 my-4 rounded-md shadow-sm"
                  >
                    <p>
                      <strong>Назва курсу:</strong> {enrollment.course.title}
                    </p>
                    <p>
                      <strong>Опис:</strong> {enrollment.course.description}
                    </p>
                    <Button
                      onClick={() => redirectToCourse(enrollment.course.id)}
                      className="mt-2 mr-2 bg-blue-500 text-white"
                    >
                      Перейти до курсу
                    </Button>
                    <Button
                      onClick={() => handleUnenroll(enrollment.course.id)}
                      className="mt-2 bg-red-500 text-white"
                    >
                      Відписатися
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Ви ще не записані на жоден курс.</p>
            )}

            <h2 className="text-xl font-bold mt-6">Коментарі</h2>
            {comments.length > 0 ? (
              <ul>
                {comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="border p-4 my-4 rounded-md shadow-sm"
                  >
                    <p>{comment.content}</p>
                    <p>Курс: {comment.course.title}</p>
                    <Button
                      onClick={() => handleEditComment(comment)}
                      className="mt-2 mr-2 bg-yellow-500 text-white"
                    >
                      Редагувати
                    </Button>
                    <Button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="mt-2 bg-red-500 text-white"
                    >
                      Видалити
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Коментарі відсутні.</p>
            )}
            {editingComment && (
              <div className="mt-4">
                <textarea
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  placeholder="Редагуйте свій коментар"
                  className="w-full p-2 border rounded mb-2"
                />
                <Button
                  onClick={handleUpdateComment}
                  className="mr-2 bg-green-500 text-white"
                >
                  Оновити коментар
                </Button>
                <Button
                  onClick={() => setEditingComment(null)}
                  className="bg-gray-500 text-white"
                >
                  Скасувати
                </Button>
              </div>
            )}

            <h2 className="text-xl font-bold mt-6">Оцінки</h2>
            {ratings.length > 0 ? (
              <ul>
                {ratings.map((rating) => (
                  <li
                    key={rating.id}
                    className="border p-4 my-4 rounded-md shadow-sm"
                  >
                    <p>Оцінка: {rating.rating}</p>
                    <p>Курс: {rating.course.title}</p>
                    <Button
                      onClick={() => handleEditRating(rating)}
                      className="mt-2 mr-2 bg-yellow-500 text-white"
                    >
                      Редагувати
                    </Button>
                    <Button
                      onClick={() => handleDeleteRating(rating.id)}
                      className="mt-2 bg-red-500 text-white"
                    >
                      Видалити
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Оцінки відсутні.</p>
            )}
            {editingRating && (
              <div className="mt-4">
                <input
                  type="number"
                  value={newRatingValue}
                  onChange={(e) => setNewRatingValue(Number(e.target.value))}
                  min="1"
                  max="5"
                  className="w-full p-2 border rounded mb-2"
                />
                <Button
                  onClick={handleUpdateRating}
                  className="mr-2 bg-green-500 text-white"
                >
                  Оновити оцінку
                </Button>
                <Button
                  onClick={() => setEditingRating(null)}
                  className="bg-gray-500 text-white"
                >
                  Скасувати
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p>Дані користувача відсутні.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
