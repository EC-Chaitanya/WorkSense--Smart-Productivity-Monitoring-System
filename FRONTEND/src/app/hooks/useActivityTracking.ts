/**
 * React hook for activity tracking
 * Provides current activity state and manages subscription to activity stream
 */

import { useEffect, useState, useRef, useCallback } from "react";
import {
  activityService,
  ActivitySnapshot,
} from "../services/activityService";

export function useActivityTracking() {
  const [currentActivity, setCurrentActivity] = useState<ActivitySnapshot | null>(
    null
  );
  const [isTracking, setIsTracking] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const trackingStartedRef = useRef(false);

  // Start tracking on mount
  useEffect(() => {
    if (!trackingStartedRef.current) {
      trackingStartedRef.current = true;
      activityService.startTracking(1500); // Poll every 1.5 seconds
      setIsTracking(activityService.isRunning());
    }

    // Subscribe to activity changes
    unsubscribeRef.current = activityService.onActivityChange((snapshot) => {
      setCurrentActivity(snapshot);
    });

    // Initial state
    const current = activityService.getCurrentActivity();
    if (current) {
      setCurrentActivity(current);
    }

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Manually control tracking
  const startTracking = useCallback(() => {
    activityService.startTracking();
    setIsTracking(true);
  }, []);

  const stopTracking = useCallback(() => {
    activityService.stopTracking();
    setIsTracking(false);
  }, []);

  return {
    currentActivity,
    isTracking,
    startTracking,
    stopTracking,
    currentApp: currentActivity?.currentApp,
    elapsedSeconds: currentActivity?.elapsedSeconds ?? 0,
    isDistracting: currentActivity?.isDistracting ?? false,
    category: currentActivity?.category,
  };
}
