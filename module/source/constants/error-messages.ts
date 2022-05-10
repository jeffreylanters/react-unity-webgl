const errorMessages = {
  /**
   * The error message for when no Unity Instance was found while trying to set
   * the fullscreen mode.
   */
  setFullscreenNoUnityInstance:
    "Unable to Set Fullscreen while Unity is not Instantiated.",
  /**
   * The error message for when no Unity Instance was found while trying to
   * request the pointer lock.
   */
  requestPointerLockNoUnityInstanceOrCanvas:
    "Unable to Request Pointer Lock while Unity is not Instantiated or the Canvas is not found.",
  /**
   * The error message for when no Unity Instance was found while trying to send
   * a message.
   */
  sendMessageNoUnityInstance:
    "Unable to Send Message while Unity is not Instantiated.",
  /**
   * The error message for when no Unity Instance was found while trying to quit
   * the Unity Instance.
   */
  quitNoUnityInstance: "Unable to Quit Unity while Unity is not Instantiated.",
  /**
   * The error message for when no Unity Instance or Canvas was found while
   * trying to take a screenshot.
   */
  screenshotNoUnityInstanceOrCanvas:
    "Unable to Take Screenshot while Unity is not Instantiated or Canvas is not available.",
  /**
   * The error message for when no event listener was found in the event
   * system.
   */
  noEventListener: "Unable to find Event Listener in Event System for Event",
};

export { errorMessages };
