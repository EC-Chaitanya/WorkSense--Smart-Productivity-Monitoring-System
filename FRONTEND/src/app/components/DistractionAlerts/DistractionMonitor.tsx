import React, { useState, useEffect, useCallback } from "react";
import { SoftWarning } from "./SoftWarning";
import { StrongWarning } from "./StrongWarning";
import { MemeAlert } from "./MemeAlert";
import { TaskConfigModal, TaskConfig } from "./TaskConfigModal";

export interface DistractionMonitorProps {
  sessionActive: boolean;
  sessionDuration?: number;
  currentApp?: string;
  onTaskConfig?: (config: TaskConfig) => void;
  memeImageUrl?: string;
}

export interface DistractionState {
  stage: 0 | 1 | 2 | 3;
  distractingAppName: string;
  distractionSeconds: number;
  totalDistractions: number;
}

export const DistractionMonitor: React.FC<DistractionMonitorProps> = ({
  sessionActive,
  sessionDuration = 1500,
  currentApp = "VS Code",
  onTaskConfig,
  memeImageUrl,
}) => {
  const [distractionState, setDistractionState] = useState<DistractionState>({
    stage: 0,
    distractingAppName: "",
    distractionSeconds: 0,
    totalDistractions: 0,
  });

  const [taskConfig, setTaskConfig] = useState<TaskConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(!taskConfig);
  const [isReturning, setIsReturning] = useState(false);

  // Load config from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("taskConfig");
    if (saved) {
      try {
        setTaskConfig(JSON.parse(saved));
        setShowConfigModal(false);
      } catch (e) {
        console.error("Failed to load task config:", e);
      }
    }
  }, []);

  // Distraction detection logic
  useEffect(() => {
    if (!sessionActive || !taskConfig) return;

    const interval = setInterval(() => {
      const isDistracting =
        !taskConfig.allowedApps.includes(currentApp) &&
        taskConfig.distractingApps.includes(currentApp);

      setDistractionState((prev) => {
        if (isDistracting && !isReturning) {
          const newSeconds = prev.distractionSeconds + 1;
          const threshold = taskConfig.distractionThreshold;

          let newStage = prev.stage;

          // Stage progression logic
          if (newSeconds === threshold && "medium" === taskConfig.alertSensitivity) {
            // Soft Warning
            newStage = 1;
          } else if (newSeconds === threshold * 1.5 && "medium" === taskConfig.alertSensitivity) {
            // Strong Warning
            newStage = 2;
          } else if (newSeconds >= threshold * 2.5 && "medium" === taskConfig.alertSensitivity) {
            // Meme Alert
            newStage = taskConfig.enableMemeAlerts ? 3 : 0;
          }

          return {
            ...prev,
            distractingAppName: currentApp,
            distractionSeconds: newSeconds,
            stage: newStage,
          };
        } else if (!isDistracting && prev.stage > 0) {
          // Reset when user returns
          return {
            stage: 0,
            distractingAppName: "",
            distractionSeconds: 0,
            totalDistractions: prev.totalDistractions + (prev.stage > 0 ? 1 : 0),
          };
        }

        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionActive, taskConfig, currentApp, isReturning]);

  const handleConfigSave = (config: TaskConfig) => {
    setTaskConfig(config);
    localStorage.setItem("taskConfig", JSON.stringify(config));
    setShowConfigModal(false);
    onTaskConfig?.(config);
  };

  const handleReturnToWork = () => {
    setIsReturning(true);
    setDistractionState((prev) => ({
      ...prev,
      stage: 0,
      distractionSeconds: 0,
    }));

    setTimeout(() => setIsReturning(false), 2000);
  };

  const handleStartFocusMode = () => {
    handleReturnToWork();
    // Navigate to focus mode (handled by parent)
  };

  const handleDismissMeme = () => {
    handleReturnToWork();
  };

  return (
    <>
      {/* Soft Warning - Stage 1 */}
      <SoftWarning
        isVisible={distractionState.stage === 1}
        onDismiss={() => {
          setDistractionState((prev) => ({ ...prev, stage: 0 }));
        }}
      />

      {/* Strong Warning - Stage 2 */}
      <StrongWarning
        isVisible={distractionState.stage === 2}
        distractingApp={distractionState.distractingAppName}
        onReturn={handleReturnToWork}
        onStartFocus={handleStartFocusMode}
      />

      {/* Meme Alert - Stage 3 */}
      <MemeAlert
        isVisible={distractionState.stage === 3}
        onDismiss={handleDismissMeme}
        memeImageUrl={memeImageUrl}
      />

      {/* Task Configuration Modal */}
      <TaskConfigModal
        isOpen={showConfigModal}
        onClose={() => {
          if (taskConfig) setShowConfigModal(false);
        }}
        onSave={handleConfigSave}
        initialConfig={taskConfig || undefined}
      />
    </>
  );
};
