const errorMessagesConstants = {
  setFullscreenNoUnityInstance:
    "Unable to Set Fullscreen while Unity is not Instantiated.",
  sendMessageNoUnityInstance:
    "Unable to Send Message while Unity is not Instantiated.",
  quitNoUnityInstance: "Unable to Quit Unity while Unity is not Instantiated.",
  screenshotNoUnityInstanceOrCanvas:
    "Unable to Take Screenshot while Unity is not Instantiated or Canvas is not available.",
  noEventListener: (eventName: string) =>
    `Unable to find Event Listener in Event System for Event Name: "${eventName}".`,
};

export { errorMessagesConstants };
