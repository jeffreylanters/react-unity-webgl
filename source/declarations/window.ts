/**
 * Type declaration for global types.
 */
interface Window {
  /**
   * Type declaration for the ReactUnityWebGL object.
   */
  ReactUnityWebGL: Object;

  /**
   * Creates a new UnityInstance.
   * @param canvasHtmlElement The target html canvas element.
   * @param parameters The paramters needed to load Unity.
   * @param onProgress The on progress event listener.
   */
  createUnityInstance(
    canvasHtmlElement: HTMLCanvasElement,
    parameters: {
      dataUrl: string;
      frameworkUrl: string;
      codeUrl: string;
      companyName?: string;
      productName?: string;
      productVersion?: string;
      streamingAssetsUrl?: string;
    },
    onProgress?: (progression: number) => void
  ): Promise<UnityInstance>;
}
