import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/authStore";

const useAuthCheck = () => {
  const { setAuthStatus, setUser, user } = useAuthStore();
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true); // New state for loading

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    console.log("Token:", token);

    if (token) {
      fetch("http://localhost:4000/auth/verify-token", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          console.log("Response status:", res.status);
          return res.json();
        })
        .then((data) => {
          console.log("Token verification response:", data);
          if (data.valid) {
            setAuthStatus(true);
            setUser(data.user);
          } else {
            setAuthStatus(false);
            router.push("/login");
          }
        })
        .catch((err) => {
          console.error("Token verification failed", err);
          setAuthStatus(false);
          router.push("/login");
        })
        .finally(() => {
          setAuthLoading(false); // Set loading to false when verification is complete
        });
    } else {
      setAuthStatus(false);
      setAuthLoading(false); // Set loading to false if no token is found
      router.push("/login");
    }
  }, [setAuthStatus, setUser, router]);

  return { user, authLoading }; // Return loading state
};

export default useAuthCheck;
