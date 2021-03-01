export default class UnityLoaderService {
  /**
   * A reference to the document head.
   * @type {HTMLHeadElement}
   */
  private documentHead: HTMLHeadElement = document.querySelector("head")!;

  /**
   * A reference to the UnityLoader script.
   * @type {HTMLScriptElement}
   */
  private unityLoaderScript?: HTMLScriptElement;

  /**
   * Appends the Unity loader script to the window. When a version of the loader
   * is already appended, we'll skip right away. When another loader is try to
   * append, the previous will be removed first.
   * @param {string} url the path to the Unity loader file
   * @param {Function} onLoad when the script is loaded
   * @returns A promise when resolving when the file is loaded.
   */
  public load(url: string): Promise<HTMLScriptElement> {
    return new Promise<HTMLScriptElement>((resolve, reject) => {
      if (typeof this.unityLoaderScript !== "undefined")
        if (url === this.unityLoaderScript.src) {
          return resolve(this.unityLoaderScript);
        } else {
          this.unityLoaderScript.remove();
        }
      this.unityLoaderScript = document.createElement("script");
      this.unityLoaderScript.type = "text/javascript";
      this.unityLoaderScript.async = true;
      this.unityLoaderScript.src = url;
      this.unityLoaderScript.onload = () => resolve(this.unityLoaderScript!);
      this.unityLoaderScript.onerror = () => reject(`Unable to load ${url}`);
      this.documentHead.appendChild(this.unityLoaderScript);
    });
  }
}
