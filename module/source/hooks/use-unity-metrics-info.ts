import { useEffect, useState } from "react";
import { MetricsConfig } from "../types/metrics-config";
import { UnityMetricsInfo } from "../types/unity-metrics-info";

/**
 * Hook to retrieve metrics information from the Unity instance.
 * This is a placeholder implementation and should be replaced with actual logic
 * to interact with the Unity instance and retrieve metrics.
 * @param unityProvider the Unity provider instance
 * @param metricsConfig configuration for metrics retrieval
 * @returns
 */
const useUnityMetricsInfo = (
  getMetricsInfo: () => UnityMetricsInfo | undefined,
  metricsConfig: MetricsConfig
): UnityMetricsInfo => {
  // Initial state for metrics info
  const [metricsInfo, setMetricsInfo] = useState<UnityMetricsInfo>({});

  // Effect to periodically retrieve metrics info from the Unity instance
  // This assumes that the Unity provider has a method `getMetricsInfo` to retrieve the metrics.
  // If this method does not exist, you will need to implement it in your Unity instance.
  // The interval for retrieving metrics is configurable via `metricsConfig`.
  useEffect(() => {
    // Set up an interval to retrieve metrics info from the Unity instance
    // The interval is defined by `metricsConfig.interval`, defaulting to 1000ms
    // if not provided.
    const intervalId = setInterval(() => {
      const info = getMetricsInfo();
      if (typeof info === "undefined") {
        // If the info is undefined, return early.
        // This could happen if the Unity instance is not ready or if there is an error
        // retrieving the metrics.
        return;
      }
      // Update the state with the retrieved metrics info
      // This will trigger a re-render of the component using this hook
      // with the new metrics info.
      setMetricsInfo(info);
    }, metricsConfig.interval || 1000);

    return () => {
      // Clear the interval when the component unmounts or when the dependencies change
      // to prevent memory leaks and unnecessary calls.
      clearInterval(intervalId);
    };
  }, [getMetricsInfo, metricsConfig.interval]);

  return metricsInfo;
};

export { useUnityMetricsInfo };
