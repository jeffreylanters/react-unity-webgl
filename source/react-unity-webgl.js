import React, { Component } from 'react';

const Message = ((gameObjectName, methodName, paramterValue) => {
    if (paramterValue == null) {
        paramterValue = "";
    }
    if (module.exports.UnityInstance != null) {
        module.exports.UnityInstance.SendMessage (
            gameObjectName, 
            methodName, 
            paramterValue);
    }
});

class Unity extends Component {
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
        if (this.props.src == null) {
            this.setState({
                error: "Please provice a path to a valid JSON in the 'src' attribute."
            });
            return;
        }
        let instance = UnityLoader.instantiate (
            "unity-container", 
            this.props.src, {
                onProgress: ((gameInstance, progress) => {
                    this.setState({
                        loaded: progress == 1,
                        progress: progress
                    });
                })
            });
        module.exports.UnityInstance = instance;
    }
    render() {
        if (this.state.error == null) {
            return this.onLoadedRender ();
        } else {
            return this.onUnableToRender ();
        }
    }
    onUnableToRender () {
        return (
            <div className="unity-container">
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

export {
    Unity,
    Message
};