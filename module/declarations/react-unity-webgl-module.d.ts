/**
 * Type declaration for the ReactUnityWebGLModule.
 */
declare type ReactUnityWebGLModule = {
  /**
   * An embedded function which will return the internal JSEvents froom Unity's
   * module. This is used to register and unregister event listeners.
   * @returns Unity's internal JSEvents object
   */
  getJSEvents(): UnityJSEvents;
};
