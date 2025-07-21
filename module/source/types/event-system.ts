import { UnityEventParameter } from "./unity-event-parameters";

/**
 * Event system for external React Unity events.
 */
type EventSystem = {
  /**
   * Adds an event listener for external React Unity events.
   * @param eventName The name of the event to listen to.
   * @param callback The callback to invoke when the event is fired.
   */
  readonly addEventListener: (
    eventName: string,
    callback: (...parameters: UnityEventParameter[]) => UnityEventParameter
  ) => void;

  /**
   * Removes an event listener for external React Unity events.
   * @param eventName The name of the event to remove.
   * @param callback The callback to remove.
   */
  readonly removeEventListener: (
    eventName: string,
    callback: (...parameters: UnityEventParameter[]) => UnityEventParameter
  ) => void;
};

export type { EventSystem };
