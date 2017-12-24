import * as React from 'react';

/**
 * Unity component will render the WebGL 
 * player.
 * @type {React.Component}
 */
export default class Unity extends React.Component<UnityProps, UnityState> { }

/**
 * Sends a message to the Unity content. 
 * This works the same as Unity's internal 
 * 'SendMessage' system. The paramaterValue
 * is an optional field.
 * @deprecated since version 6.4.0
 * @type {function}
 * @param {string} gameObjectName 
 * @param {string} methodName 
 * @param {object} paramterValue 
 * @returns {void} void
 */
export function SendMessage (
    /**
     * The gameObject name within Unity
     * within the hierarchy.
     * @type {string}
     */
    gameObjectName: string, 

    /**
     * The name of the method you want
     * to call. The method must be on
     * any script attached tot the
     * game object and must be public.
     * @type {string}
     */
    methodName: string, 

    /**
     * Optional parameter value which
     * will be passed to the opbject.
     * @type {string}
     */
    paramterValue?: any
): void;

/**
 * UnityEvent created an emittable event 
 * which can trigger a function within 
 * Unity with a given parameter.
 * @type {class}
 */
export class UnityEvent {
    /**
     * Creates a new UnityEvent.
     * @type {constructor}
     * @param {string} gameObjectName 
     * @param {string} methodName 
     */
    constructor (
        /**
         * The gameObject name within Unity
         * within the hierarchy.
         * @type {string}
         */
        gameObjectName: string,

        /**
         * The name of the method you want
         * to call. The method must be on
         * any script attached tot the
         * game object and must be public.
         * @type {string}
         */
        methodName: string
    );

    /**
     * The gameObject name within Unity
     * within the hierarchy.
     * @type {string}
     */
    gameObjectName: string;

    /**
     * The name of the method you want
     * to call. The method must be on
     * any script attached tot the
     * game object and must be public.
     * @type {string}
     */
    methodName: string;

    /**
     * Emits the event to the defined
     * gameObject with the given
     * parameter.
     * @type {function}
     * @returns {void} void
     */
    emit: (
        /**
         * Optional parameter value which
         * will be passed to the opbject.
         */
        parameter?: any
    ) => void;

    /**
     * Check wether the event can be
     * emitted to the unityContent.
     * @type {function}
     * @returns {boolean} canEmit
     */
    canEmit: () => boolean;
}

/**
 * Registers a listener to this window.
 * When a message is sent from Unity using 
 * 'CallExternal', the listener will 
 * forward it into your React Application.
 * @type {function}
 * @param {string} functionName 
 * @param {function} callback 
 */
export function RegisterExternalListener (
    /**
     * The methodname which will be available
     * from outside of react. This will be the
     * method name you can use from your JSLib
     * or CallExternal.
     * @type {string}
     */
    methodName: string, 

    /**
     * The callback event which will be triggered
     * by unity. You can bind a function or create
     * one.
     * @type {function}
     * @returns {void} void
     */
    callback: (
        /**
         * The parameter passed from the Unity
         * content.
         * @type {any}
         */
        parameter: any
    ) => void 
): void;

/**
 * Props for the Unity Component
 * @type {object}
 */
interface UnityProps {
    /**
     * Public path to the by Unity generated 
     * json file. This is in most cases relative
     * from your HTML file.
     * @type {string}
     */
    src: string;

    /**
     * Public path to the by Unity generated 
     * loader file. This is in most cases relative
     * from your HTML file.
     * @type {string}
     */
    loader: string;

    /**
     * Function which will be called every time
     * the loading process updates.
     * @type {function}
     */
    onProgress?: (
        /**
         * The number of progression. This will be
         * a number between 0 and 1. When the
         * content is loaded, 1 will be passed.
         * @type {number}
         */
        progression: number
    ) => void;

    /**
     * The width of the Unity component. If none
     * is passed, the player have a width of 100%.
     * @type {number}
     */
    width?: number;

    /**
     * The height of the Unity component. If none
     * is passed, the player have a height of 100%.
     * @type {number}
     */
    height?: number;

    /**
     * Optional modules which will override Unity's
     * default module object.
     * @type {Module}
     */
    module?: Module;
}

/**
 * The state of the Unity compontent.
 * @type {object}
 */
interface UnityState {
    /**
     * The error thrown by the compontent.
     * If there is no error, error will be
     * null.
     * @type {string}
     */
    error?: string;
}
