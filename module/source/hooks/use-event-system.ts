import { useCallback, useEffect, useRef } from "react";
import { errorMessagesConstants } from "../constants/error-messages-constants";
import { isBrowserEnvironment } from "../constants/is-browser-environment";
import { IEventListener } from "../interfaces/event-listener";
import { IEventSystemHook } from "../interfaces/event-system-hook";

/**
 * An array of dispatch event methods from within the mounted event systems.
 * This allows an event to be dispatched within all of the event system
 * instances.
 */
const mountedEventDispatchers: ((
  eventName: string,
  ...parameters: ReactUnityEventParameterType[]
) => void)[] = [];

/**
 * Dispatches an event to all mounted event systems.
 * @param eventName The name of the event to dispatch.
 * @param parameters The parameters to pass to the event listener.
 */
const dispatchReactUnityEvent = (
  eventName: string,
  ...parameters: ReactUnityEventParameterType[]
): void =>
  // Loops through all of the mounted event systems and dispatches the event.
  mountedEventDispatchers.forEach((dispatchEvent) =>
    dispatchEvent(eventName, ...parameters)
  );

if (isBrowserEnvironment === true) {
  // It is possible for the application being rendered server side. We'll check
  // if the app is running in a browser environment and if so, we'll make the
  // dispatch React Unity event function available to the global scope.
  window.dispatchReactUnityEvent = dispatchReactUnityEvent;
}

/**
 * Event system for invoking external React Unity events.
 * @returns The Event System hook.
 */
const useEventSystem = (): IEventSystemHook => {
  /**
   * An array of all registered event listeners.
   */
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
   * Dispatches an event.
   */
  const dispatchEvent = useCallback(
    /**
     * @param eventName The name of the event to dispatch.
     * @param parameters The parameters to pass to the event listener.
     */
    (
      eventName: string,
      ...parameters: ReactUnityEventParameterType[]
    ): void => {
      // The event listener will be filtered from the event listeners array
      // based on its name.
      const eventListener = eventListeners.current.find(
        (eventListener) => eventListener.eventName === eventName
      );
      if (typeof eventListener === "undefined") {
        // Guarding the event listener.
        console.warn(errorMessagesConstants.noEventListener(eventName));
        return;
      }
      // The event listener will be invoked with the parameters.
      eventListener.callback(...parameters);
    },
    [eventListeners]
  );

  // Effect ensures that the dispatch event function is available to the
  // global array of event listeners. This allows the global method to dispatch
  // events within the event system hooks.
  useEffect(() => {
    mountedEventDispatchers.push(dispatchEvent);
    return () => {
      mountedEventDispatchers.splice(
        mountedEventDispatchers.indexOf(dispatchEvent),
        1
      );
    };
  }, [dispatchEvent]);

  return {
    addEventListener,
    removeEventListener,
  };
};

export { useEventSystem };
