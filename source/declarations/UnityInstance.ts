declare class UnityInstance {
  constructor();

  /**
   * Sends an message to the unity player.
   * @param gameObjectName the game object name.
   * @param methodName the public method name.
   * @param parameter an optional parameter.
   * @public
   */
  public SendMessage(
    gameObjectName: string,
    methodName: string,
    parameter?: any
  ): void;

  /**
   * Sets the player to fullscreen.
   * @param {boolean} fullScreen
   * @public
   */
  public SetFullscreen(fullScreen: number): void;
}
