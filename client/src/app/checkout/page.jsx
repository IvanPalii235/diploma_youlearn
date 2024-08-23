"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the Zod schema for the payment form
const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "Card number must be 16 digits")
    .max(16, "Card number must be 16 digits"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, "Invalid expiry date"),
  cvc: z.string().min(3, "CVC must be 3 digits").max(3, "CVC must be 3 digits"),
});

const Checkout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      // Validate the form inputs
      paymentSchema.parse({ cardNumber, expiryDate, cvc });

      setLoading(true);

      const response = await fetch("http://localhost:4000/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie.split("token=")[1]}`,
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        throw new Error("Payment failed");
      }

      router.push(`/courses/${courseId}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error("Error during payment:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-md shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Checkout
        </h1>
        <div>
          <Input
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            maxLength={16} // Set maxLength
          />
          {errors.cardNumber && (
            <p className="text-red-500">{errors.cardNumber}</p>
          )}
          <Input
            placeholder="Expiry Date (MM/YY)"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            maxLength={5} // Set maxLength for MM/YY format
          />
          {errors.expiryDate && (
            <p className="text-red-500">{errors.expiryDate}</p>
          )}
          <Input
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            maxLength={3} // Set maxLength
          />
          {errors.cvc && <p className="text-red-500">{errors.cvc}</p>}
          <Button
            onClick={handlePayment}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Processing..." : "Buy Course"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
