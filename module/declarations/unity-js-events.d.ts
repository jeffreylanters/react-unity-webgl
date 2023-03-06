/**
 * Type declaration for the Unity Module's internal JavaScript Events.
 */
declare type UnityJSEvents = {
  /**
   * Determines whether the event handler requests can be performed.
   */
  canPerformEventHandlerRequests(): UnityBooleanLike;

  /**
   * Removes all event listeners.
   */
  removeAllEventListeners(): void;
};
