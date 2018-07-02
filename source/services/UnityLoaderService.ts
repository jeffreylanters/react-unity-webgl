export default class UnityLoaderService {
  /**
   * Reference to the document head.
   * @type {HTMLHeadElement}
   * @private
   */
  private documentHead: HTMLHeadElement = document.getElementsByTagName(
    "head"
  )[0];

  /**
   * Reference to the unity loader script.
   * @type {HTMLScriptElement}
   * @private
   */
  private unityLoaderScript?: HTMLScriptElement;
  
  /**
   * Appends the Unity loader script to the window. When it's loaded a callback will
   * be triggered. NOTE: This can't be a promisse due to JavaScript compatibilty.
   * @param {string} source the path to the Unity loader file
   * @param {Function} onLoad when the script is loaded
   * @public
   */
  public append(source: string, onLoad: Function): void {
    // Unity is going to overwrite the console error function. Yeah,
    // I didn't believe it either. Anyway, we're going to store the
    // native pointer and restore that after Unity loaded.
    const _consoleLog = window.console.error;

    // We're going to load the UnityLoader async.
    this.unityLoaderScript = document.createElement("script");
    this.unityLoaderScript.type = "text/javascript";
    this.unityLoaderScript.async = true;
    this.unityLoaderScript.src = source;
    this.unityLoaderScript.onload = () => {
    
      // First we restore the console error function back to
      // the window before starting your Unity player.
      window.console.error = _consoleLog;
      onLoad();
    };
    this.documentHead.appendChild(this.unityLoaderScript);
  }
}
