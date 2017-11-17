/**
 * Registers a listener to this window. When a message is sent
 * from Unity using 'CallExternal', the listener will forward it
 * into your React Application.
 * @param {string} functionName 
 * @param {function} callback 
 */
export function RegisterExternalListener (functionName, callback) {
    window[functionName] = paramterValue => {
        callback (paramterValue)
    }
}