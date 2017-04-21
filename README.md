# react-unity-webgl
A Unity WebGL component for your React application.

# installation
Install using npm. Make sure you download the version matching with your Unity version. I try to update this plugin in case of need as fast as possible.

```sh
# example
$ npm install --save react-unity-webgl@5.6.0
```

# usage
To get stated import the Unity component from 'react-unity-webgl'. Once imported you can use the Unity component to load in your Unity content. Place the Unity tag along with a src to the json file Unity exported.

```js
import React, { Component } from 'react';
import { Unity } from '/Projects/react-unity-webgl';

export class App extends Component {
    render() {
        return (<div className="app">
            <Unity src="Build/viewer.json" />
        </div>)
    }
}
```

# communication
Unity allows you to send Javascript messages to the Unity content. In order to do so using React you have to import the Message function from 'react-unity-webgl'. The first parameter is the target game object name, the next is the method name, and the last is a optional parameter value.

```js
import React, { Component } from 'react';
import { Message } from '/Projects/react-unity-webgl'

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
/* Example styling */
.unity-container {
    canvas {
        /* ... */
    }
}
.unity-loader {
    /* ... */
    .bar {
        /* ... */
        .fill {
            /* the width will be set
             * by the component
            ... */
        }
    }
}
```