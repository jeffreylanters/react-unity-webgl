import { UnityInstance } from '../components/Unity'

export function SendMessage(gameObjectName, methodName, paramterValue) {
    console.warn(`SendMessage is deprecated since version 6.4.0, use UnityEvent instead.`)
    if (typeof UnityInstance !== 'undefined')
        UnityInstance.SendMessage(
            gameObjectName,
            methodName,
            paramterValue || '')
    else
        console.warn(`Wait for Unity to be instantiated before sending a message to '${gameObjectName}'`)
}