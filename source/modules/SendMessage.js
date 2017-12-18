import { UnityInstance } from '../components/Unity'

/**
 * Sends a message to the Unity content. This works the same
 * as Unity's internal 'SendMessage' system. The paramaterValue
 * is an optional field.
 * @param {string} gameObjectName 
 * @param {string} methodName 
 * @param {object} paramterValue 
 */
export function SendMessage (gameObjectName, methodName, paramterValue) {
    if (typeof paramterValue === 'undefined')
        paramterValue = ''

    if (typeof UnityInstance !== 'undefined')
        UnityInstance.SendMessage (gameObjectName, methodName, paramterValue)
    else
        console.warn (`Wait for Unity to be instantiated before sending a message to '${gameObjectName}'`)
}