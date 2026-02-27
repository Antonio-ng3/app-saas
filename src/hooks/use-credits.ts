"use client";

import { useEffect, useState } from "react";

export function useCredits() {
  const [credits, setCredits] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/credits")
      .then((res) => res.json())
      .then((data) => {
        setCredits(data.credits);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const refresh = () => {
    fetch("/api/user/credits")
      .then((res) => res.json())
      .then((data) => setCredits(data.credits));
  };

  const deduct = async () => {
    // Optimistic update
    const previousCredits = credits;
    setCredits((prev) => Math.max(0, prev - 1));

    try {
      const res = await fetch("/api/user/credits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits: Math.max(0, previousCredits - 1) }),
      });

      if (!res.ok) {
        // Revert on error
        setCredits(previousCredits);
        throw new Error("Failed to deduct credits");
      }

      const data = await res.json();
      setCredits(data.credits);
    } catch (error) {
      // Revert on error
      setCredits(previousCredits);
      console.error("Error deducting credits:", error);
      throw error;
    }
  };

  return { credits, isLoading, refresh, deduct };
}
