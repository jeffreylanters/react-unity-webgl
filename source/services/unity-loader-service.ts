// TODO turn into hook
export class UnityLoaderService {
  /**
   * A reference to all UnityLoader script tags and their respective urls.
   * @private
   * @type {Array<{ url: string; htmlScriptElement: HTMLScriptElement; }>}
   */
  private static unityLoaderInstances: Array<{
    url: string;
    htmlScriptElement: HTMLScriptElement;
  }> = new Array();

  /**
   * A reference to the document head.
   * @private
   * @type {HTMLHeadElement}
   */
  private documentHead: HTMLHeadElement | undefined =
    typeof document !== "undefined"
      ? document.querySelector("head")!
      : undefined;

  /**
   * Adds the Unity loader script to the window. When a version of the loader
   * is already appended, we'll skip to the validation right away. Before
   * resolving a type check on the createUnityInstance method is done.
   * @public
   * @param {string} url the path to the Unity loader file
   * @returns {Promise<void>} A promise when resolving when the file is loaded succesfulling.
   */
  public async addFromUrl(url: string): Promise<void> {
    let _hasSimilarUnityLoaderUrlInstance = false;
    for (let _unityLoaderInstance of UnityLoaderService.unityLoaderInstances)
      if (_unityLoaderInstance.url === url)
        _hasSimilarUnityLoaderUrlInstance = true;
    if (_hasSimilarUnityLoaderUrlInstance === false) {
      const _htmlScriptElement = await this.appendAndLoadScript(url);
      UnityLoaderService.unityLoaderInstances.push({
        url,
        htmlScriptElement: _htmlScriptElement,
      });
    }
    if (typeof createUnityInstance !== "function")
      throw new Error("Unable to invoke Unity Loader, loaded incorrectly.");
  }

  /**
   * Appends a new script tag to the window. The promise resolves when the script
   * is loaded and rejects when it failed to load.
   * @private
   * @param {string} url The url of the script
   * @returns A promise containing the HTML Script Ele,ent
   */
  private appendAndLoadScript(url: string): Promise<HTMLScriptElement> {
    return new Promise<HTMLScriptElement>((resolve, reject) => {
      if (typeof this.documentHead !== "undefined") {
        var _scriptTag = document.createElement("script");
        _scriptTag.type = "text/javascript";
        _scriptTag.async = true;
        _scriptTag.src = url;
        _scriptTag.onload = () => resolve(_scriptTag!);
        _scriptTag.onerror = (error: string | Event) =>
          reject(`Unable to load ${url} ${error}`);
        this.documentHead.appendChild(_scriptTag);
      }
    });
  }
}
