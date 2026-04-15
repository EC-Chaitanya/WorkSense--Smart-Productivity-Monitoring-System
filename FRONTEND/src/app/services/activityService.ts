/**
 * Activity Service - Manages real-time activity tracking
 * Polls the Flask backend's /current-app endpoint for REAL window titles.
 * NO simulated apps, NO dummy data — only real data from tracker.py.
 */

export interface Activity {
  appName: string;
  category: "Productive" | "Distraction" | "Neutral";
  isDistracting: boolean;
  startTime: Date;
  duration?: number;
}

export interface ActivitySnapshot {
  currentApp: string;
  category: "Productive" | "Distraction" | "Neutral";
  isDistracting: boolean;
  sessionStartTime: Date;
  elapsedSeconds: number;
  timestamp: Date;
}

export class ActivityService {
  private activityLog: Activity[] = [];
  private currentActivity: Activity | null = null;
  private sessionStartTime: Date = new Date();
  private isTracking: boolean = false;
  private trackingInterval: NodeJS.Timeout | null = null;
  private listeners: Array<(snapshot: ActivitySnapshot) => void> = [];
  private distractionListeners: Array<(app: string, threshold: number) => void> = [];
  private distractionStartTime: Map<string, number> = new Map();
  private distractionThreshold: number = 30; // seconds

  constructor() {
    this.sessionStartTime = new Date();
  }

  /**
   * Start continuous activity tracking by polling the real backend
   */
  startTracking(intervalMs: number = 2000): void {
    if (this.isTracking) return;

    this.isTracking = true;
    console.log("[ActivityService] Starting real-time tracking via backend polling every", intervalMs, "ms");

    // Poll the backend for real window titles
    this.trackingInterval = setInterval(() => {
      this.pollBackendActivity();
    }, intervalMs);

    // Initial poll
    this.pollBackendActivity();
  }

  /**
   * Stop continuous activity tracking
   */
  stopTracking(): void {
    if (!this.isTracking) return;

    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }

    this.isTracking = false;
    console.log("[ActivityService] Stopped tracking");
  }

  /**
   * Poll the Flask backend for the real current window title
   */
  private async pollBackendActivity(): Promise<void> {
    try {
      const response = await fetch("http://localhost:5000/current-app");
      if (!response.ok) return;

      const data = await response.json();
      const title = data?.window_title;
      const category = data?.category || "Neutral";

      // Skip empty/unknown titles
      if (!title || title.trim() === "" || title === "Unknown") return;

      const mappedCategory = category as "Productive" | "Distraction" | "Neutral";
      const isDistracting = mappedCategory === "Distraction";

      // Only process if the app actually changed
      if (this.currentActivity && this.currentActivity.appName === title) {
        // Same app — just notify listeners and check distraction threshold
        this.notifyListeners();
        this.checkDistractionThreshold();
        return;
      }

      // Log previous activity to backend before switching
      if (this.currentActivity) {
        // If we're switching away from a distracting app, clear tracking
        if (this.currentActivity.isDistracting) {
          this.distractionStartTime.delete(this.currentActivity.appName);
        }
      }

      // Switch to new real app
      this.currentActivity = {
        appName: title,
        category: mappedCategory,
        isDistracting,
        startTime: new Date(),
      };

      console.log(
        `[ActivityService] Real app detected: "${title}" (${mappedCategory})`
      );

      // Track distraction start time
      if (isDistracting) {
        this.distractionStartTime.set(title, Date.now());
      }

      this.activityLog.push({ ...this.currentActivity });
      this.notifyListeners();
      this.checkDistractionThreshold();
    } catch {
      // Backend not available — silently ignore
    }
  }

  /**
   * Check if distraction threshold has been exceeded
   */
  private checkDistractionThreshold(): void {
    if (!this.currentActivity || !this.currentActivity.isDistracting) {
      return;
    }

    const startTime = this.distractionStartTime.get(
      this.currentActivity.appName
    );
    if (!startTime) return;

    const elapsedSeconds = (Date.now() - startTime) / 1000;

    if (
      elapsedSeconds >= this.distractionThreshold &&
      elapsedSeconds % 5 < 2
    ) {
      // Trigger distraction alert — pass the REAL window title
      this.distractionListeners.forEach((listener) =>
        listener(this.currentActivity!.appName, this.distractionThreshold)
      );
    }
  }

  /**
   * Notify all listeners of current activity
   */
  private notifyListeners(): void {
    if (!this.currentActivity) return;

    const snapshot: ActivitySnapshot = {
      currentApp: this.currentActivity.appName,
      category: this.currentActivity.category,
      isDistracting: this.currentActivity.isDistracting,
      sessionStartTime: this.sessionStartTime,
      elapsedSeconds: Math.round(
        (new Date().getTime() - this.currentActivity.startTime.getTime()) / 1000
      ),
      timestamp: new Date(),
    };

    this.listeners.forEach((listener) => listener(snapshot));
  }

  /**
   * Subscribe to activity changes
   */
  onActivityChange(
    listener: (snapshot: ActivitySnapshot) => void
  ): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Subscribe to distraction alerts
   */
  onDistractionThreshold(
    listener: (app: string, threshold: number) => void
  ): () => void {
    this.distractionListeners.push(listener);

    return () => {
      this.distractionListeners = this.distractionListeners.filter(
        (l) => l !== listener
      );
    };
  }

  /**
   * Get current activity snapshot
   */
  getCurrentActivity(): ActivitySnapshot | null {
    if (!this.currentActivity) return null;

    return {
      currentApp: this.currentActivity.appName,
      category: this.currentActivity.category,
      isDistracting: this.currentActivity.isDistracting,
      sessionStartTime: this.sessionStartTime,
      elapsedSeconds: Math.round(
        (new Date().getTime() - this.currentActivity.startTime.getTime()) / 1000
      ),
      timestamp: new Date(),
    };
  }

  /**
   * Manually set distraction threshold
   */
  setDistractionThreshold(seconds: number): void {
    this.distractionThreshold = seconds;
  }

  /**
   * Get activity history
   */
  getActivityLog(): Activity[] {
    return [...this.activityLog];
  }

  /**
   * Reset the service (for testing or new session)
   */
  reset(): void {
    this.stopTracking();
    this.activityLog = [];
    this.currentActivity = null;
    this.sessionStartTime = new Date();
    this.distractionStartTime.clear();
    this.listeners = [];
    this.distractionListeners = [];
  }

  /**
   * Check if tracking is actively running
   */
  isRunning(): boolean {
    return this.isTracking;
  }
}

// Export a singleton instance
export const activityService = new ActivityService();
