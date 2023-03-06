/**
 * Appends the React Unity WebGL module to the Unity Module object during its
 * pre-processing phase.
 */
Module.reactUnityWebGL = {
  /**
   * An embedded function which will return the internal JSEvents froom Unity's
   * module. This is used to register and unregister event listeners.
   * @returns {JSEvents} Unity's internal JSEvents object
   */
  getJSEvents: function () {
    return JSEvents;
  },
};
