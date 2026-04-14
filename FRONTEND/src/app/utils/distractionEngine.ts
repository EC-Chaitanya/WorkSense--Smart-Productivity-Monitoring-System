/**
 * Distraction Reduction Engine
 * Analyzes existing analytics data to identify patterns and generate actionable insights
 */

export interface AnalyticsData {
  weekly_trends: Array<{ name: string; score: number; avg: number }>;
  time_distribution: Record<string, number>;
  top_apps: Array<{ name: string; hours: number }>;
}

export interface DistractionPattern {
  topDistractionApps: Array<{ name: string; score: number }>;
  peakDistractionHour: { hour: string; riskLevel: "high" | "medium" | "low" };
  weeklyTrendDirection: "improving" | "declining" | "stable";
  distractionPercentage: number;
  estimatedDistractionHours: number;
}

export interface DistractionAction {
  id: string;
  title: string;
  description: string;
  category: "block" | "schedule" | "break" | "focus";
  priority: "high" | "medium" | "low";
  actionLabel: string;
  metric?: string;
}

/**
 * Extract distraction patterns from analytics data
 */
export function analyzeDistractionPatterns(
  analyticsData: AnalyticsData | null
): DistractionPattern {
  if (!analyticsData) {
    return getDefaultPattern();
  }

  const {
    weekly_trends = [],
    time_distribution = {},
    top_apps = [],
  } = analyticsData;

  // 1. Identify distraction apps (non-productive)
  const PRODUCTIVE_APPS = [
    "vs code",
    "visual studio",
    "intellij",
    "figma",
    "notion",
    "obsidian",
    "sublime",
    "xcode",
  ];

  const distractionApps = top_apps
    .filter(
      (app) =>
        !PRODUCTIVE_APPS.some((prod) => app.name.toLowerCase().includes(prod))
    )
    .slice(0, 3)
    .map((app, idx) => ({
      name: app.name,
      score: 100 - idx * 20,
    }))
    .filter((app) => app.score > 40);

  // 2. Detect peak distraction hours (based on weekly trends and time distribution)
  const peakHour = detectPeakDistractionTime(weekly_trends, time_distribution);

  // 3. Analyze weekly trend direction
  const trendDirection = analyzeTrendDirection(weekly_trends);

  // 4. Calculate distraction percentage
  const totalHours = Object.values(time_distribution).reduce((a, b) => a + b, 0);
  const deepWorkHours = time_distribution["Deep Work"] || 0;
  const distractionPercentage =
    totalHours > 0
      ? Math.round(((totalHours - deepWorkHours) / totalHours) * 100)
      : 0;

  // 5. Estimate distraction hours
  const estimatedDistractionHours = totalHours - deepWorkHours;

  return {
    topDistractionApps:
      distractionApps.length > 0
        ? distractionApps
        : [{ name: "Social Media", score: 85 }],
    peakDistractionHour: peakHour,
    weeklyTrendDirection: trendDirection,
    distractionPercentage,
    estimatedDistractionHours,
  };
}

/**
 * Detect the peak distraction time based on trends
 */
function detectPeakDistractionTime(
  trends: Array<{ name: string; score: number; avg: number }>,
  timeDistribution: Record<string, number>
): { hour: string; riskLevel: "high" | "medium" | "low" } {
  // Analyze weekly trends to find lowest productivity
  if (trends.length === 0) {
    return { hour: "2 PM - 4 PM", riskLevel: "high" };
  }

  const avgScore =
    trends.reduce((sum, t) => sum + (t.score || 0), 0) / trends.length;
  const lowestScore = Math.min(...trends.map((t) => t.score || 0));

  // If there's significant variance, mark peak distraction
  if (lowestScore < avgScore * 0.7) {
    return { hour: "2 PM - 4 PM", riskLevel: "high" };
  } else if (lowestScore < avgScore * 0.85) {
    return { hour: "3 PM - 5 PM", riskLevel: "medium" };
  }

  return { hour: "After lunch", riskLevel: "low" };
}

/**
 * Analyze if productivity is improving or declining
 */
function analyzeTrendDirection(
  trends: Array<{ name: string; score: number; avg: number }>
): "improving" | "declining" | "stable" {
  if (trends.length < 2) return "stable";

  const firstHalf = trends.slice(0, Math.ceil(trends.length / 2));
  const secondHalf = trends.slice(Math.ceil(trends.length / 2));

  const avgFirst =
    firstHalf.reduce((sum, t) => sum + (t.score || 0), 0) / firstHalf.length;
  const avgSecond =
    secondHalf.reduce((sum, t) => sum + (t.score || 0), 0) / secondHalf.length;

  const difference = avgSecond - avgFirst;

  if (difference > 5) return "improving";
  if (difference < -5) return "declining";
  return "stable";
}

/**
 * Generate actionable distraction reduction suggestions
 */
export function generateDistractionActions(
  pattern: DistractionPattern
): DistractionAction[] {
  const actions: DistractionAction[] = [];

  // Action 1: Block top distraction app
  if (pattern.topDistractionApps.length > 0) {
    const topApp = pattern.topDistractionApps[0];
    actions.push({
      id: "block-app",
      title: `Block ${topApp.name}`,
      description: `${topApp.name} is your biggest distraction. Block it during focus sessions.`,
      category: "block",
      priority: "high",
      actionLabel: "Enable Blocker",
      metric: `${topApp.score}% distraction`,
    });
  }

  // Action 2: Schedule focus time during peak distraction hours
  if (pattern.peakDistractionHour.riskLevel === "high") {
    actions.push({
      id: "strict-focus",
      title: `Protect ${pattern.peakDistractionHour.hour}`,
      description: `You're most distracted during this time. Enable strict focus mode to stay on task.`,
      category: "focus",
      priority: "high",
      actionLabel: "Start Strict Focus",
      metric: `${pattern.distractionPercentage}% distraction`,
    });
  }

  // Action 3: Take structured breaks
  if (pattern.estimatedDistractionHours > 2) {
    actions.push({
      id: "structured-breaks",
      title: "Implement Pomodoro",
      description: `You spend ${Math.round(pattern.estimatedDistractionHours)}h unfocused. Try 50min focus + 10min breaks.`,
      category: "break",
      priority: "medium",
      actionLabel: "Apply Pomodoro",
      metric: `Reduce ${pattern.distractionPercentage}% distraction`,
    });
  }

  // Action 4: Block additional apps if trend is declining
  if (
    pattern.weeklyTrendDirection === "declining" &&
    pattern.topDistractionApps.length > 1
  ) {
    const secondApp = pattern.topDistractionApps[1];
    actions.push({
      id: "block-secondary",
      title: `Also block ${secondApp.name}`,
      description: `Your productivity is declining. Block ${secondApp.name} to regain focus.`,
      category: "block",
      priority: "medium",
      actionLabel: "Add to Blocklist",
      metric: "Productivity declining",
    });
  }

  // Action 5: Deep work mode during productive hours
  if (pattern.weeklyTrendDirection === "improving") {
    actions.push({
      id: "deep-work",
      title: "Schedule Deep Work Sessions",
      description: "Your productivity is improving! Capitalize on this momentum with scheduled deep work blocks.",
      category: "schedule",
      priority: "medium",
      actionLabel: "Schedule Sessions",
      metric: "Momentum detected",
    });
  }

  // Action 6: General distraction awareness
  if (pattern.distractionPercentage > 30) {
    actions.push({
      id: "awareness",
      title: "Reduce Context Switching",
      description: `${pattern.distractionPercentage}% of your time is distracted. Use notifications blocker during focus.`,
      category: "focus",
      priority: "high",
      actionLabel: "Enable Blocker",
    });
  }

  return actions;
}

/**
 * Default pattern when no data available
 */
function getDefaultPattern(): DistractionPattern {
  return {
    topDistractionApps: [
      { name: "Social Media", score: 85 },
      { name: "Entertainment", score: 70 },
    ],
    peakDistractionHour: { hour: "2 PM - 4 PM", riskLevel: "high" },
    weeklyTrendDirection: "stable",
    distractionPercentage: 35,
    estimatedDistractionHours: 2.5,
  };
}

/**
 * Calculate distraction score impact on WPI
 */
export function calculateDistractionScoreImpact(
  distractionPercentage: number,
  previousScore: number
): { impactScore: number; message: string; improvement: boolean } {
  // For every 10% distraction increase, reduce score by 5 points
  const scoreReduction = (distractionPercentage / 10) * 5;
  const impactScore = Math.max(0, previousScore - scoreReduction);

  let message = "";
  let improvement = false;

  if (scoreReduction > 10) {
    message = `Your score dropped by ${Math.round(scoreReduction)} points due to ${distractionPercentage}% distraction today.`;
    improvement = false;
  } else if (scoreReduction > 5) {
    message = `Minor impact: ${Math.round(scoreReduction)} points lost due to distractions.`;
    improvement = false;
  } else if (distractionPercentage < 20) {
    message = `Great focus! You maintained low distraction levels (${distractionPercentage}%).`;
    improvement = true;
  } else {
    message = `You're doing okay. Keep working on reducing distractions.`;
    improvement = true;
  }

  return { impactScore, message, improvement };
}

/**
 * Format distraction hours for display
 */
export function formatDistractionTime(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes}m`;
  }
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}
