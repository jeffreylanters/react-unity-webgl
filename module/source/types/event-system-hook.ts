/**
 * Event system for external React Unity events.
 */
type EventSystemHook = {
  /**
   * Adds an event listener for external React Unity events.
   * @param eventName The name of the event to listen to.
   * @param callback The callback to invoke when the event is fired.
   */
  readonly addEventListener: (
    eventName: string,
    callback: (
      ...parameters: ReactUnityEventParameter[]
    ) => ReactUnityEventParameter
  ) => void;

  /**
   * Removes an event listener for external React Unity events.
   * @param eventName The name of the event to remove.
   * @param callback The callback to remove.
   */
  readonly removeEventListener: (
    eventName: string,
    callback: (
      ...parameters: ReactUnityEventParameter[]
    ) => ReactUnityEventParameter
  ) => void;
};

export type { EventSystemHook };
