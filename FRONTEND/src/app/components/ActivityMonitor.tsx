/**
 * Global Activity Monitor Component
 * This component runs once at the app root level and manages continuous activity tracking
 * It should be mounted in AppLayout or App.tsx to ensure tracking persists across routes
 */

import React, { useEffect, useRef, useState } from "react";
import { activityService } from "../services/activityService";

export const ActivityMonitor: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationRef = useRef(false);

  useEffect(() => {
    // Initialize only once (even in StrictMode)
    if (initializationRef.current) return;
    initializationRef.current = true;

    // Start the activity service
    console.log("[ActivityMonitor] Initializing continuous activity tracking...");
    activityService.startTracking(1500); // Poll every 1.5 seconds
    
    setIsInitialized(true);

    // Listen for distraction events
    const unsubscribeDistraction = activityService.onDistractionThreshold(
      (app, threshold) => {
        console.log(
          `[ActivityMonitor] ALERT: User has been on ${app} for ${threshold}+ seconds`
        );
        // This event can be caught by other components that subscribe to it
        // Dispatch or emit event here if using context/event system
      }
    );

    // Cleanup on unmount
    return () => {
      unsubscribeDistraction();
      // Don't stop tracking - let it continue in background
    };
  }, []);

  // This component renders nothing - it's just for managing the service lifecycle
  return null;
};

export default ActivityMonitor;
