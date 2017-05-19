# react-unity-webgl
Easy to use Unity 5.6 or newer WebGL player component for your React application. Embed your Unity application in your react application for writing interactive interfaces with two way Unity and react communication.

<img src="http://react-etc.net/files/2016-07/logo-578x270.png" height="50px"/> <img src="http://gamepadable.com/wp-content/uploads/2016/01/Official_unity_logo.png" height="50px"/>

# installation
Install using npm. Make sure you download the version matching with your Unity version. I try to update this plugin in case of need as fast as possible.

```sh
# example
$ npm install --save react-unity-webgl@5.6.0
```

# usage
To get stated import the Unity component from 'react-unity-webgl'. Once imported you can use the Unity component to load in your Unity content. Place the Unity tag along with a src to the json file Unity exported.

> ### Notice
> Don't forget to add a script tag to load the `UnityLoader.js` file, exported by Unity in your base html file.

```js
import React, { Component } from 'react';
import { Unity } from 'react-unity-webgl';

export class App extends Component {
    render() {
        return (<div className="app">
            <Unity src="Build/myGame.json" />
        </div>)
    }
}
```

# communication
Unity allows you to send Javascript messages to the Unity content. In order to do so using React you have to import the Message function from 'react-unity-webgl'. The first parameter is the target game object name, the next is the method name, and the last is a optional parameter value.

```js
import React, { Component } from 'react';
import { Message } from 'react-unity-webgl'

export class Menu extends Component {
    onClick () {
        Message ("myGameObjectName", "myMethodName", "paramterValue");
    }
    render() {
        return (<div className="menu">
            <div onClick={this.onClick.bind(this)}>
                Click me
            </div>
        </div>)
    }
}
```

# styling
The player will be injected in the a component with the className "unity-container". To style to player use the following sass styling. To style the loader you can style the component with the className "unity-loader". See the example below.

```scss
.unity {
    .unity-container {
        canvas {
            
        }
    }
    .unity-loader {
        .bar {
            .fill {
                /* the width will be set by the component */
            }
        }
    }
}
```
