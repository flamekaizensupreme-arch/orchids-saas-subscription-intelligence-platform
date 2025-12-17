"use client";

import { useState, useEffect } from "react";

const TOUR_COMPLETED_KEY = "subsentry_tour_completed";

export function useTour() {
  const [tourCompleted, setTourCompleted] = useState(true);
  const [shouldRunTour, setShouldRunTour] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_COMPLETED_KEY);
    const isCompleted = completed === "true";
    setTourCompleted(isCompleted);
    
    if (!isCompleted) {
      setShouldRunTour(true);
    }
  }, []);

  const completeTour = () => {
    localStorage.setItem(TOUR_COMPLETED_KEY, "true");
    setTourCompleted(true);
    setShouldRunTour(false);
  };

  const restartTour = () => {
    setShouldRunTour(true);
  };

  return {
    tourCompleted,
    shouldRunTour,
    completeTour,
    restartTour,
  };
}
