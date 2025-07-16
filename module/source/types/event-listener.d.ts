import { UnityEventParameter } from "./unity-event-parameters";

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
  callback: (...parameters: UnityEventParameter[]) => UnityEventParameter;
};

export type { EventListener };
