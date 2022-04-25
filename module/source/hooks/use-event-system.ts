import { useCallback, useRef } from "react";
import { IEventListener } from "../interfaces/event-listener";
import { IEventSystemHook } from "../interfaces/event-system-hook";

const eventSystemHooks: IEventSystemHook[] = [];
const handleDispatchReactUnityEvent = (...args: any[]): void => {
  console.log(args);
};
(window as any).dispatchReactUnityEvent = handleDispatchReactUnityEvent;

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
      callback: (...parameters: ReactUnityEventParameterType[]) => void
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
      callback: (...parameters: ReactUnityEventParameterType[]) => void
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

  /**
   * Dispatches an event to external React Unity events.
   */
  const dispatchEvent = useCallback(
    /**
     * @param eventName The name of the event to dispatch.
     * @param parameters The parameters to pass to the event listener.
     * @returns The result of the dispatched event.
     * @throws An error if the event name is not found.
     */
    (eventName: string, ...parameters: ReactUnityEventParameterType[]): any => {
      // The event listener will be filtered from the event listeners array
      // based on its name.
      const eventListener = eventListeners.current.find(
        (eventListener) => eventListener.eventName === eventName
      );
      // If the event listener is not found, an error will be thrown.
      if (typeof eventListener === "undefined") {
        throw new Error(`Event "${eventName}" not found.`);
      }
      // The event listener will be invoked with the parameters.
      eventListener.callback(...parameters);
    },
    [eventListeners]
  );

  return {
    addEventListener,
    removeEventListener,
  };
};

export { useEventSystem };
