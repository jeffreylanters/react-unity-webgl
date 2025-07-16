/**
 * Metrics configuration type definition.
 * This type is used to define the configuration for metrics collection in Unity.
 * It includes an optional interval property to specify the frequency of metrics collection.
 */
type MetricsConfig = {
  /**
   * The interval in milliseconds at which to collect metrics.
   */
  interval?: number;
};

export type { MetricsConfig };
