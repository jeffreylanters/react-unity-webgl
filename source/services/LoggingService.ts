class LoggingService {
  public warnUnityContentRemoveNotAvailable(additionalDetials?: any): void {
    this.warn(
      "Your version of Unity does not support unloading the WebGL Player.",
      "This preverts ReactUnityWebGL from unmounting this component properly.",
      "Please consider updating to Unity 2019.1 or newer, or reload the page",
      "to free the WebGL Player from the memory. See the follow link for more details:",
      "https://github.com/elraccoone/react-unity-webgl/issues/22",
      additionalDetials
    );
  }

  public errorUnityLoaderNotFound(additionalDetials?: any): void {
    this.error(
      "Unable to use the Unity Loader, please make sure you've imported",
      "the Unity Loader the correct way. You might have entered an incorrect",
      "path to the UnityLoader.js. The path is not relative to your bundle,",
      "but to your index html file. See the follow link for more details: ",
      "https://github.com/elraccoone/react-unity-webgl/issues/31",
      additionalDetials
    );
  }

  private warn(...messages: string[]): void {
    console.warn(messages.filter(_ => typeof _ !== "undefined").join(" "));
  }

  private error(...messages: string[]): void {
    console.error(messages.filter(_ => typeof _ !== "undefined").join(" "));
  }
}

export const loggingService = new LoggingService();
