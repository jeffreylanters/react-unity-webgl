import React, { Component } from 'react'
import UnityLoaderService from './UnityLoaderService'
import Styles from './Styles'

export default class Unity extends Component {
    constructor (props) {
        super (props)
        this.state = {
            error: null
        }
        this.unityLoaderService = new UnityLoaderService ()
    }
    componentDidMount () {
        this.instantiate ()
    }
    componentWillUnmount () {
        this.unityLoaderService.unmount ()
    }
    instantiate () {
        let error = null

        if (typeof this.props.loader === 'undefined')
            error = 'Please provide Unity with a path to the UnityLoader in the loader prop.'
        if (typeof this.props.src === 'undefined')
            error = 'Please provide Unity with a path to a valid JSON in the src prop.'

        if (error !== null) {
            console.error (error)
            this.setState ({ error: error })
        } 
        else {
            this.unityLoaderService.append (this.props.loader).then (() => {
                let unityInstance = UnityLoader.instantiate ('unity', this.props.src, {
                    onProgress: this.onProgress.bind (this),
                    Module : this.props.module
                })
                module.exports.UnityInstance = unityInstance
            })
        }
    }
    onProgress (unityInstance, progression) {
        if (typeof this.props.onProgress !== 'undefined') {
            this.props.onProgress (progression)
        }
    }
    getContainerStyles () {
        return {
            width: this.props.width || '100%',
            height: this.props.height || '100%'
        }
    }
    render () {
        return (
            <div className='unity' style={this.getContainerStyles ()}>
                {this.state.error !== null ? (
                    <b>React-Unity-Webgl error {this.state.error}</b>
                ):(
                    <div style={Styles.unity} id='unity'></div>
                )}
            </div>
        )
    }
}