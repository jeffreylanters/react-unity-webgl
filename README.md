# React Unity WebGL
When building content for the web, you might need to communicate with other elements on React Application. Or you might want to implement functionality using Web APIs which [Unity](https://unity3d.com) does not currently expose by default. In both cases, you need to directly interface with the browser’s JavaScript engine. React Unity WebGL provides an easy library for Unity 5.6 / 2017 or newer with different methods to do this.

<img src="http://react-etc.net/files/2016-07/logo-578x270.png" height="50px"/> <img src="http://gamepadable.com/wp-content/uploads/2016/01/Official_unity_logo.png" height="50px"/>





# Installation
Install using npm. Make sure you download the release matching with your Unity version. I try to update this plugin in case of need as fast as possible. Check the [releases on GitHub](https://github.com/jeffreylanters/react-unity-webgl/releases) for the corresponding version.

```sh
$ npm install --save react-unity-webgl
```





# Usage
To get started import the default Unity class from react-unity-webgl.

```js
import React from 'react';
import Unity from 'react-unity-webgl';

export class App extends React.Component {
    constructor () {
        this.build = {
            data: 'Build/myGame.json',
            loader: 'Build/UnityLoader.json'
        }
    }
    render () {
        return <Unity build={ this.build } />
    }
}
```
## Optional attributes

```js
// Overruling the module
<Unity build={ this.build } module={ this.myCustomModule } />
```





## Calling Unity scripts functions from JavaScript in React
Sometimes you need to send some data or notification to the Unity script from the browser’s JavaScript. The recommended way of doing it is to call methods on GameObjects in your content. To get started import the function SendMessage from react-unity-webgl.

```js
SendMessage (objectName, methodName, value);
```

Where objectName is the name of an object in your scene; methodName is the name of a method in the script, currently attached to that object; value can be a string, a number, or can be empty. For example:
```js
import React from 'react';
import { SendMessage } from 'react-unity-webgl';

export class App extends React.Component {
    spawnEnemy (count) {
        SendMessage ('SpawnBehaviour', 'SpawnEnemies', count);
    }
    render () {
        return <div onClick={ this.spawnEnemy.bind(this, 5) }>
            Click to Spawn 5 Enemies</div>
    }
}
```
```cs
using UnityEngine;

public class SpawnController: MonoBehaviour {
    public void SpawnEnemies (int count) {
        Debug.Log (string.Format ("Spawning {0} enemies", count));
    }
}
```





## Calling JavaScript functions within React from Unity scripts
We also allow you to call JavaScript functions within React from the Unity Content. To get started import the function RegisterExternalListener from react-unity-webgl.
```js
RegisterExternalListener (methodName, callback);
```
Where methodName is the name of a method in the script, this method will be binded to the current browser window so Unity can refer to it; callback canwill be a function, which takes one parameter with the value passed by your content. Note that it is recommended to register the callbacks before loading the Unity content. For example:
```js
import React from 'react';
import { RegisterExternalListener } from 'react-unity-webgl';

export class App extends React.Component {
    constructor () {
        RegisterExternalListener ('OpenMenu', this.openMenu.bind (this));
    }
    openMenu (menuId) {
        console.log (`opening menu with id ${menuId$}`);
    }
}
```
```cs
using UnityEngine;

public class MenuController: MonoBehaviour {
    [DllImport("__Internal")]
    private static extern void OpenMenu (string menuId);
    public void OpenReactMenuById (string menuId) {
        OpenMenu (menuId);
    }
}
```
Simple numeric types can be passed to JavaScript in function parameters without requiring any conversion. Other data types will be passed as a pointer in the emscripten heap (which is really just a big array in JavaScript). For strings, you can use the Pointer_stringify helper function to convert to a JavaScript string. To return a string value you need to call _malloc_ to allocate some memory and the writeStringToMemory helper function to write a JavaScript string to it. If the string is a return value, then the il2cpp runtime will take care of freeing the memory for you. For arrays of primitive types, emscripten provides different ArrayBufferViews into it’s heap for different sizes of integer, unsigned integer or floating point representations of memory: HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64. To access a texture in WebGL, emscripten provides the GL.textures array which maps native texture IDs from Unity to WebGL texture objects. WebGL functions can be called on emscripten’s WebGL context, GLctx.

Legacy ways of calling JavaScript code from Unity. You can use the Application.ExternalCall () and Application.ExternalEval () functions to invoke JavaScript code on the embedding web page. Note that expressions are evaluated in the local scope of the build. If you would like to execute JavaScript code in the global scope, see the Code Visibility section below.





# Styling
The following hierarchy will be applied to the React Unity WebGL component. Feel free to apply any styles to the component.

```scss
.unity {
    .unity-container {
        canvas {
            /* don't forget to set my width and height! */
        }
    }
    .unity-loader {
        .loading-bar {
            .loading-fill {
                /* the width will be set by the component */
            }
        }
    }
}
```





# Contributing
When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change. Before commiting, please compile your code using `npm run compile` and open a pull request. Thank you very much!