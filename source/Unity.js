import React, { Component } from 'react'
import UnityLoaderService from './UnityLoaderService'

export default class Unity extends Component {
    constructor (props) {
        super (props)
        this.state = {
            progress: 0,
            loaded: false,
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
                module.exports.UnityInstance = UnityLoader.instantiate ('unity-container', this.props.src, {
                    onProgress: ((gameInstance, progress) => {
                        this.setState({
                            loaded: progress === 1,
                            progress: progress
                        })
                    }),
                    Module : this.props.module
                })
            })
        }
    }
    render () {
        if (this.state.error !== null) { return (
            <div className='unity'>
                <b>React-Unity-Webgl error</b> {this.state.error}
            </div>
        )}
        return (
            <div className='unity'>
                <div>
                    <div className='unity-container' id='unity-container'></div>
                </div>
                {this.state.loaded === false &&
                    <div className='unity-loader'>
                        <div className='bar'>
                            <div className='fill' style={{ width:`${(this.state.progress * 100)}%`}}></div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}