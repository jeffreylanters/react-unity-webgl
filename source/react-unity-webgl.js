import React, { Component } from 'react';

export default class Unity extends Component {
    constructor (props) {
        super (props);
        this.state = {
            progress: 0,
            loaded: false,
            error: null
        };
    }
    componentDidMount () {
        this.instantiateUnityLoader ();
    }
    instantiateUnityLoader () {
        if (typeof UnityLoader === 'undefined') {
            let errorText = "The UnityLoader was not defined, please add the script tag " +
                "to the base html and embed the UnityLoader.js file Unity exported.";
            console.error(errorText);
            this.setState({
                error: errorText
            });
            return;
        }
        if (this.props.src == null) {
            let errorText = "Please provice a path to a valid JSON in the 'src' attribute.";
            console.error(errorText);
            this.setState({
                error: errorText
            });
            return;
        }
        let instance = UnityLoader.instantiate(
            "unity-container", 
            this.props.src, {
                onProgress:((gameInstance, progress) => {
                    this.setState({
                        loaded: progress == 1,
                        progress: progress
                    });
                }),
                Module : this.props.module
            });
        module.exports.UnityInstance = instance;
    }
    render() {
        if (this.state.error == null) {
            return this.onLoadedRender();
        } else {
            return this.onUnableToRender();
        }
    }
    onUnableToRender () {
        return (
            <div className="unity">
                <b>React-Unity-Webgl error</b>: 
                {this.state.error}
            </div>
        );
    }
    onLoadedRender () {
        return (
            <div className="unity">
                <div className="unity-container" id="unity-container"></div>
                {this.state.loaded == false &&
                    <div className="unity-loader">
                        <div className="bar">
                            <div className="fill" style={{ width: (this.state.progress * 100) + "%"}}></div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

/**
 * Sends a message to the Unity content. This works the same
 * as Unity's internal 'SendMessage' system. The paramaterValue
 * is an optional field.
 * @param {string} gameObjectName 
 * @param {string} methodName 
 * @param {object} paramterValue 
 */
export function SendMessage (gameObjectName, methodName, paramterValue) {
    if (paramterValue === undefined) {
        paramterValue = "";
    }
    if (module.exports.UnityInstance !== null) {
        module.exports.UnityInstance.SendMessage (
            gameObjectName, 
            methodName, 
            paramterValue);
    } else {
        console.warn (`Your message to object '${gameObjectName}' was send before Unity was instantiated.`)
    }
}

/**
 * Registers a listener to this window. When a message is sent
 * from Unity using 'CallExternal', the listener will forward it
 * into your React Application.
 * @param {string} functionName 
 * @param {function} callback 
 */
export function RegisterExternalListener (functionName, callback) {
    window[functionName] = function (paramterValue) {
        callback (paramterValue);
    }
}