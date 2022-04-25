const errorMessagesConstants = {
  /**
   * The error message for when no Unity Instance was found while trying to set
   * the fullscreen mode.
   */
  setFullscreenNoUnityInstance:
    "Unable to Set Fullscreen while Unity is not Instantiated.",
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
   * @param eventName The name of the event listener.
   * @returns The error message for when no event listener was found.
   */
  noEventListener: (eventName: string) =>
    `Unable to find Event Listener in Event System for Event Name: "${eventName}".`,
};

export { errorMessagesConstants };
