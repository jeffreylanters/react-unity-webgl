import { useCallback, useEffect, useRef } from "react";
import { IEventListener } from "../interfaces/event-listener";
import { IEventSystemHook } from "../interfaces/event-system-hook";

/**
 * Event system for external React Unity events.
 * @returns The Unity Context hook.
 */
const useEventSystem = (): IEventSystemHook => {
  const eventListeners = useRef<IEventListener[]>([]);

  /**
   * Adds an event listener for external React Unity events.
   */
  const addEventListener = useCallback(
    /**
     * @param eventName The name of the event to listen to.
     * @param callback The callback to invoke when the event is fired.
     */
    (
      eventName: string,
      callback: (...parameters: ReactUnityEventArgumentType[]) => void
    ) => {
      // Add the event listener will be added to the array of event listeners.
      eventListeners.current = [
        ...eventListeners.current,
        { eventName, callback },
      ];
    },
    [eventListeners]
  );

  /**
   * Removes an event listener for external React Unity events.
   */
  const removeEventListener = useCallback(
    /**
     * @param eventName The name of the event to remove.
     * @param callback The callback to remove.
     */
    (
      eventName: string,
      callback: (...parameters: ReactUnityEventArgumentType[]) => void
    ) => {
      // The event listener will be filtered from the event listeners array
      // based on its name and the reference to the callback.
      eventListeners.current = eventListeners.current.filter(
        (eventListener) =>
          eventListener.eventName !== eventName &&
          eventListener.callback !== callback
      );
    },
    [eventListeners]
  );

  return {
    addEventListener,
    removeEventListener,
  };
};

export { useEventSystem };
