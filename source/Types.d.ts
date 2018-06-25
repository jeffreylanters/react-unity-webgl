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
    static instantiate(elementId: string, source: string, options?: Object): UnityInstance;
}
declare class UnityInstance {
    constructor();
    /**
     * Sends an message to the unity player.
     * @param gameObjectName the game object name.
     * @param methodName the public method name.
     * @param parameter an optional parameter.
     * @public
     */
    SendMessage(gameObjectName: string, methodName: string, parameter?: any): void;
    /**
     * Sets the player to fullscreen.
     * @param {boolean} fullScreen
     * @public
     */
    SetFullscreen(fullScreen: number): void;
}
declare class ReactUnityWebGL {
}
//# sourceMappingURL=Types.d.ts.map