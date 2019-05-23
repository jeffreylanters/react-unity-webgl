class LoggingService {
  public warnUnityContentRemoveNotAvailable(): void {
    this.warn(
      "Your version of Unity does not support unloading the WebGL Player.",
      "This preverts ReactUnityWebGL from unmounting this component properly.",
      "Please consider updating to Unity 2019.1 or newer, or reload the page",
      "to free the WebGL Player from the memory. See the follow link for more details:",
      "https://github.com/elraccoone/react-unity-webgl/issues/22"
    );
  }

  public errorUnityLoaderNotFound(): void {
    // TODO
  }

  private warn(...messages: string[]): void {
    console.warn(messages.join(" "));
  }

  private error(...messages: string[]): void {
    console.error(messages.join(" "));
  }
}

export const loggingService = new LoggingService();
