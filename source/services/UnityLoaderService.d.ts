export default class UnityLoaderService {
    private documentHead;
    private unityLoaderScript?;
    constructor();
    /**
     * Appends the Unity loader script to the window. When it's loaded a callback will
     * be triggered. NOTE: This can't be a promisse due to JavaScript compatibilty.
     * @param {string} source the path to the Unity loader file
     * @param {Function} onLoad when the script is loaded
     * @public
     */
    append(source: string, onLoad: Function): void;
}
//# sourceMappingURL=UnityLoaderService.d.ts.map