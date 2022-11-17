/**
 * An event listener.
 */
type EventListener = {
  /**
   * The name of the event to listen to.
   */
  eventName: string;

  /**
   * The callback to invoke when the event is fired.
   */
  callback: (
    ...parameters: ReactUnityEventParameter[]
  ) => ReactUnityEventParameter;
};

export type { EventListener };
