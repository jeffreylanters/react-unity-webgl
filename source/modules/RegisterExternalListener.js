/**
 * Registers a listener to this window. When a message is sent
 * from Unity using 'CallExternal', the listener will forward it
 * into your React Application.
 * @param {string} functionName 
 * @param {function} callback 
 */
export function RegisterExternalListener (functionName, callback) {
    /**
     * LEGACY
     *  bind the function to the window to allow
     *  the user to use the legacy functions
     *  Application.ExternalCall and
     *  Application.ExternalEval.
     */
    window[functionName] = paramterValue => {
        callback (paramterValue)
    }

    /**
     * Bind the function in the ReactUnityWebGL
     * object so the user can use a JSLib file
     * to make direct calls into React.
     */
    if (typeof window.ReactUnityWebGL === 'undefined')
        window.ReactUnityWebGL = {}
    window.ReactUnityWebGL[functionName] = paramterValue => {
        callback (paramterValue)
    }
}