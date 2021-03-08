/**
 * The event map contains all of the keys and their respective parameter types
 * which can be used from adding event listeners to a Unity Context instance.
 */
export default interface IUnityContextEventMap {
  /**
   * While your game is being downloaded from the server and loaded into memory,
   * you might want to display some sort of loading indicator informing the user
   * of the progression. The built-in progression event listeners can be used
   * for such cases. On Progress is emitted while the Unity player is being
   * loaded. The parameter contains the progression from 0 to 1. When the game
   * is fully loaded into memory and will start execution, the progression will
   * hit 1. The event will invoke everytime the progression advances.
   */
  progress: [number];

  /**
   * While your application is being downloaded from the server and loaded into
   * memory, you might want to display some sort of overlay or loading screen.
   * The built-in loaded event listeners can be used for such cases. On Loaded
   * is emitted when the Unity player is loaded into memory and execution is
   * started. Event will be invoked only once.
   */
  loaded: [void];

  /**
   * When your Applications run into a runtime error, you might want to display
   * your players any kind of error screen, or debug the problem yourself. The
   * built-in error event listeners can be used for such cases. On Error is
   * emitted while the Unity Player runs into an error. This is most likely a
   * runtime error. The error details and stack trace are passed along via the
   * parameter.
   */
  error: [string];

  /**
   * The quitted event is emitted in two cases, when the Unity component is
   * unmounted, and when Application.Quit is invoked from within your Unity
   * Application. In both cases the Unity Player will be unloaded from memory.
   */
  quitted: [void];
}
