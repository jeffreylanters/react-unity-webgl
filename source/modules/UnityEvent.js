import { UnityInstance } from '../components/Unity'

export class UnityEvent {
    constructor(gameObjectName, methodName) {
        this.gameObjectName = gameObjectName
        this.methodName = methodName
    }
    emit(parameter) {
        if (this.canEmit() === true)
            UnityInstance.SendMessage(
                this.gameObjectName,
                this.methodName,
                typeof parameter !== 'undefined' ? parameter : '')
        else
            console.warn(`Wait for Unity to be instantiated before sending an event '${this.methodName}'`)
    }
    canEmit() {
        return typeof UnityInstance !== 'undefined'
    }
}