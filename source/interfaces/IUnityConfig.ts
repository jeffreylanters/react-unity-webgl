export default interface IUnityConfig {
  /**
   * The unique identifier helps you getting the instance
   * of your context from any other class.
   * @type {string}
   */
  id?: string;

  /**
   * Unity Module injection.
   * @type {Object}
   */
  modules?: Object;

  /**
   * Since the Unity canvas itself does not respond to the resizing
   * of it's container we have to manually do this. A width and height
   * of 100% does not seem to work, so we have to fetch it's parent's
   * size to adject the canvas.
   * @type {boolean}
   */
  adjustOnWindowResize?: boolean;
}
