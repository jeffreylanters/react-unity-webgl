declare class UnityLoader {
  constructor();

  /**
   * Initializes a new Unity player.
   * @param elementId the element ID where to bind the player.
   * @param source the path to the build json source.
   * @param options optional options to pass to the player.
   * @public
   * @static
   */
  public static instantiate(
    elementId: string,
    source: string,
    options?: Object
  ): UnityInstance;

  /**
   * Unity error handler.
   */
  public static Error: {
    handler: (error: string) => void;
  };
}
