export default interface IUnityModule {
  /**
   * An array of arguments.
   * @public
   * @type {string[]}
   */
  arguments: string[];

  /**
   * An array of all disabled canvas events.
   * @public
   * @type {string[]}
   */
  disabledCanvasEvents: string[];

  /**
   * Writes a log message to the console.
   * @public
   * @type {(message: string) => void}
   */
  print?: (message: string) => void;

  /**
   * Writes an error message to the console.
   * @public
   * @type {(message: string) => void}
   */
  printErr?: (message: string) => void;
}
