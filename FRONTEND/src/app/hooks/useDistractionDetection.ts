/**
 * Hook for handling real-time distraction detection and alerts
 * Monitors current activity and triggers distraction alerts based on threshold
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { activityService } from "../services/activityService";

export interface DistractionAlert {
  type: "soft" | "strong" | "meme";
  app: string;
  timeSpent: number;
  timestamp: Date;
  message: string;
}

export function useDistractionDetection(onAlert?: (alert: DistractionAlert) => void) {
  const [distractionAlerts, setDistractionAlerts] = useState<DistractionAlert[]>([]);
  const [currentDistractionApp, setCurrentDistractionApp] = useState<string | null>(null);
  const [distractionTime, setDistractionTime] = useState(0);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const alertCountRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    // Subscribe to distraction threshold events from activity service
    unsubscribeRef.current = activityService.onDistractionThreshold(
      (app: string, threshold: number) => {
        const timesAlerted = alertCountRef.current.get(app) ?? 0;
        const alertType: "soft" | "strong" | "meme" =
          timesAlerted === 0 ? "soft" : timesAlerted === 1 ? "strong" : "meme";

        const alert: DistractionAlert = {
          type: alertType,
          app,
          timeSpent: threshold,
          timestamp: new Date(),
          message: getAlertMessage(alertType, app, threshold),
        };

        // Add to alert history
        setDistractionAlerts((prev) => [...prev.slice(-4), alert]); // Keep last 5

        // Update app distracting time
        setCurrentDistractionApp(app);
        setDistractionTime(threshold);

        // Call callback if provided
        if (onAlert) {
          onAlert(alert);
        }

        // Increment alert count for this app
        alertCountRef.current.set(app, timesAlerted + 1);

        console.log(`[DistractionDetection] ${alertType.toUpperCase()} alert: ${app} (${threshold}s)`);
      }
    );

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [onAlert]);

  // Reset distraction count when user switches away from distracting app
  useEffect(() => {
    const checkActivityType = setInterval(() => {
      const current = activityService.getCurrentActivity();
      if (current && !current.isDistracting) {
        // User switched to productive/neutral app - reset distraction tracking
        if (currentDistractionApp) {
          setCurrentDistractionApp(null);
          setDistractionTime(0);
          // Reset alert count for next distraction session
          alertCountRef.current.clear();
        }
      }
    }, 2000);

    return () => clearInterval(checkActivityType);
  }, [currentDistractionApp]);

  const dismissAlert = useCallback((index: number) => {
    setDistractionAlerts((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }, []);

  const resetDistractionTracking = useCallback(() => {
    setCurrentDistractionApp(null);
    setDistractionTime(0);
    alertCountRef.current.clear();
    setDistractionAlerts([]);
  }, []);

  return {
    distractionAlerts,
    currentDistractionApp,
    distractionTime,
    dismissAlert,
    resetDistractionTracking,
    hasActiveDistraction: !!currentDistractionApp,
  };
}

/**
 * Get context-specific alert message for distraction
 */
function getAlertMessage(
  type: "soft" | "strong" | "meme",
  app: string,
  timeSpent: number
): string {
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  const timeStr =
    minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  switch (type) {
    case "soft":
      return `You've been on ${app} for ${timeStr}. Time for a break?`;
    case "strong":
      return `⚠️ Still on ${app}? You've spent ${timeStr} here. Let's refocus.`;
    case "meme":
      return `Bro… seriously? ${app} for ${timeStr}? 😅 Time to get back!`;
  }
}
