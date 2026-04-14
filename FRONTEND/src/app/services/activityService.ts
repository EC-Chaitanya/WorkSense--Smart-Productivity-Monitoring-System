/**
 * Activity Service - Simulates and manages continuous activity tracking
 * This service creates realistic activity streams and logs them to the backend
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

// Simulated apps and their categories
const APP_DATABASE = {
  productive: [
    { name: "VS Code", category: "Productive" as const, weight: 8 },
    { name: "Figma", category: "Productive" as const, weight: 7 },
    { name: "Notion", category: "Productive" as const, weight: 8 },
    { name: "Obsidian", category: "Productive" as const, weight: 6 },
    { name: "Terminal", category: "Productive" as const, weight: 7 },
  ],
  neutral: [
    { name: "Mail", category: "Neutral" as const, weight: 5 },
    { name: "Slack", category: "Neutral" as const, weight: 5 },
    { name: "Calendar", category: "Neutral" as const, weight: 4 },
    { name: "Finder", category: "Neutral" as const, weight: 3 },
    { name: "System Preferences", category: "Neutral" as const, weight: 2 },
  ],
  distracting: [
    { name: "YouTube", category: "Distraction" as const, weight: 9 },
    { name: "Twitter", category: "Distraction" as const, weight: 8 },
    { name: "Instagram", category: "Distraction" as const, weight: 9 },
    { name: "TikTok", category: "Distraction" as const, weight: 10 },
    { name: "Netflix", category: "Distraction" as const, weight: 9 },
    { name: "Reddit", category: "Distraction" as const, weight: 7 },
  ],
  idle: [
    { name: "Idle", category: "Neutral" as const, weight: 3 },
  ],
};

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
   * Start continuous activity tracking
   */
  startTracking(intervalMs: number = 1000): void {
    if (this.isTracking) return;

    this.isTracking = true;
    console.log("[ActivityService] Starting continuous tracking every", intervalMs, "ms");

    // Initial activity
    this.switchToRandomApp();

    // Poll for activity changes and log to backend
    this.trackingInterval = setInterval(() => {
      this.pollActivityChange();
    }, intervalMs);
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
   * Poll for activity changes (simulates OS activity monitoring)
   * In a real implementation, this would integrate with OS-level APIs
   */
  private pollActivityChange(): void {
    // 30% chance to switch apps every polling interval
    if (Math.random() < 0.15) {
      this.switchToRandomApp();
    }

    // Notify listeners with current snapshot
    if (this.currentActivity) {
      this.notifyListeners();
    }

    // Check for distraction threshold
    this.checkDistractionThreshold();
  }

  /**
   * Switch to a random app (simulates user switching apps)
   */
  private switchToRandomApp(): void {
    const allApps = [
      ...APP_DATABASE.productive,
      ...APP_DATABASE.neutral,
      ...APP_DATABASE.distracting,
    ];

    // Weight selection based on app weight (more productive apps = higher chance)
    const weightedApps = allApps.flatMap((app) =>
      Array(app.weight).fill(app)
    );
    const randomApp =
      weightedApps[Math.floor(Math.random() * weightedApps.length)];

    // Only log if actually switching
    if (
      this.currentActivity &&
      this.currentActivity.appName === randomApp.name
    ) {
      return;
    }

    // Log current activity to backend before switching
    if (this.currentActivity) {
      this.logActivityToBackend(this.currentActivity);

      // Check if we're switching away from a distracting app
      if (this.currentActivity.isDistracting) {
        this.distractionStartTime.delete(this.currentActivity.appName);
      }
    }

    // Switch to new app
    this.currentActivity = {
      appName: randomApp.name,
      category: randomApp.category,
      isDistracting: randomApp.category === "Distraction",
      startTime: new Date(),
    };

    console.log(
      `[ActivityService] Switched to: ${this.currentActivity.appName} (${randomApp.category})`
    );

    // Track distraction start time
    if (this.currentActivity.isDistracting) {
      this.distractionStartTime.set(
        this.currentActivity.appName,
        Date.now()
      );
    }

    this.activityLog.push({ ...this.currentActivity });
    this.notifyListeners();
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
      elapsedSeconds % 5 < 1
    ) {
      // Trigger distraction alert every 5 seconds after threshold
      this.distractionListeners.forEach((listener) =>
        listener(this.currentActivity!.appName, this.distractionThreshold)
      );
    }
  }

  /**
   * Log activity to backend
   */
  private logActivityToBackend(activity: Activity): void {
    const duration =
      (new Date().getTime() - activity.startTime.getTime()) / 1000;

    if (duration < 1) return; // Don't log activities shorter than 1 second

    const payload = {
      window_title: activity.appName,
      category: activity.category,
      duration: Math.round(duration),
    };

    // Fire and forget - don't block on this
    fetch("http://localhost:5000/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => console.error("[ActivityService] Failed to log activity:", err));
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
