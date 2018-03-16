import { UnityInstance } from '../components/Unity'

export class UnityFullscreen {
    constructor() {

    }
    emit(parameter) {
        if (this.canEmit() === true)
            UnityInstance.SetFullscreen(1);
        else
            console.warn(`Wait for Unity to be instantiated before sending an event '${this.methodName}'`)
    }
    canEmit() {
        return typeof UnityInstance !== 'undefined'
    }
}
