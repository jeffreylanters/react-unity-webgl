import { loggingService } from "./LoggingService";

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
    if (typeof this.unityLoaderScript !== "undefined")
      if (source === this.unityLoaderScript.src) {
        return onLoad();
      } else {
        this.unityLoaderScript.remove();
      }
    window
      .fetch(source)
      .then(_response => {
        if (_response.status >= 400)
          return loggingService.errorUnityLoaderNotFound(_response.status);
        _response
          .text()
          .then(_text => {
            if (_text.trim().charAt(0) === "<")
              return loggingService.errorUnityLoaderNotFound("error doc");
            this.unityLoaderScript = document.createElement("script");
            this.unityLoaderScript.type = "text/javascript";
            this.unityLoaderScript.async = true;
            this.unityLoaderScript.src = source;
            this.unityLoaderScript.onload = () => {
              if (typeof (window as any).UnityLoader === "undefined")
                return loggingService.errorUnityLoaderNotFound();
              onLoad();
            };
            this.documentHead.appendChild(this.unityLoaderScript);
          })
          .catch(_reason => loggingService.errorUnityLoaderNotFound(_reason));
      })
      .catch(_reason => loggingService.errorUnityLoaderNotFound(_reason));
  }
}
