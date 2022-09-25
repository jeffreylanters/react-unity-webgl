/**
 * An event listener.
 */
interface IEventListener {
  /**
   * The name of the event to listen to.
   */
  eventName: string;

  /**
   * The callback to invoke when the event is fired.
   */
  callback: (
    ...parameters: ReactUnityEventParameterType[]
  ) => ReactUnityEventParameterType;
}

export type { IEventListener };
