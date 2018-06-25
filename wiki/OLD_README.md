👀 [Example GIF](https://raw.githubusercontent.com/jeffreylanters/react-unity-webgl/master/resources/readme/demo-video.gif)<br/>
🚀 [Test environment](https://github.com/jeffreylanters/react-unity-webgl-test)

Props

- [Unity Content](https://github.com/jeffreylanters/react-unity-webgl/blob/master/wiki/props-unity-content.md)
- [Class Name](https://github.com/jeffreylanters/react-unity-webgl/blob/master/wiki/props-class-name.md)
- [Width and Height](https://github.com/jeffreylanters/react-unity-webgl/blob/master/wiki/props-width-and-height.md)

Unity Config

- [Identifier](https://github.com/jeffreylanters/react-unity-webgl/blob/master/wiki/unity-options-id.md)
- [Modules](https://github.com/jeffreylanters/react-unity-webgl/blob/master/wiki/unity-options-modules.md)
- [Unity Version](https://github.com/jeffreylanters/react-unity-webgl/blob/master/wiki/unity-options-unity-version.md)

Communication

- [Calling Unity methods from React](https://github.com/jeffreylanters/react-unity-webgl/blob/master/wiki/communication-calling-unity-methods-from-react.md)
- [Calling React methods from Unity](https://github.com/jeffreylanters/react-unity-webgl/blob/master/wiki/communication-calling-react-methods-from-unity.md)
- [Unity Loading Event](https://github.com/jeffreylanters/react-unity-webgl/blob/master/wiki/communication-unity-loading-event.md)
- [Unity Ready Event](https://github.com/jeffreylanters/react-unity-webgl/blob/master/wiki/communication-unity-ready-event.md)

Other

- [Unity Loader Best practices]()
- [6.x to 7.x Upgrade note](https://github.com/jeffreylanters/react-unity-webgl/blob/master/wiki/other-6x-to-7x-upgrade-note)
- [JavaScript to UnityScript types](https://github.com/jeffreylanters/react-unity-webgl/blob/master/wiki/other-javascript-to-unityscript-types)
- [TypeScript and JSDocs](https://github.com/jeffreylanters/react-unity-webgl/blob/master/wiki/other-typescript-and-jsdocs)
- [Contributing](https://github.com/jeffreylanters/react-unity-webgl/blob/master/wiki/other-contributing)

---

# React Unity WebGL &middot; [![license](https://img.shields.io/badge/license-MIT-red.svg)]() [![npm](https://img.shields.io/npm/v/react-unity-webgl.svg)]() [![npm](https://img.shields.io/badge/build-passing-brightgreen.svg)]() [![npm](https://img.shields.io/npm/dt/react-unity-webgl.svg)]() [![npm](https://img.shields.io/badge/typescript-supported-2a507e.svg)]()

When building content for the web, you might need to communicate with other elements on React Application. Or you might want to implement functionality using Web APIs which [Unity](https://unity3d.com) does not currently expose by default. In both cases, you need to directly interface with the browser’s JavaScript engine. React Unity WebGL provides an easy library for Unity 5.6^, 2017 and 2018 with different methods to do this.

<img src="https://raw.githubusercontent.com/jeffreylanters/react-unity-webgl/master/resources/readme/logo.png" width="300px"><br />

👀 [Example GIF](https://raw.githubusercontent.com/jeffreylanters/react-unity-webgl/master/resources/readme/demo-video.gif)<br/>
🚀 [Test environment](https://github.com/jeffreylanters/react-unity-webgl-test)

- [Installation](#installation)
- [Usage](#usage)
- [Optional attributes](#optional-attributes)
  - [Width and height](#width-and-height)
  - [Tracking progression](#tracking-progression)
  - [Modules](#modules)
  - [Fullscreen](#fullscreen)
- [Calling Unity scripts functions from JavaScript in React](#calling-unity-scripts-functions-from-javascript-in-react)
- [Calling JavaScript functions within React from Unity scripts](#calling-javascript-functions-within-react-from-unity-scripts)
- [Notes](#notes)
  - [Best practices for adding the src and loader files on a public path](#best-practices-for-adding-the-src-and-loader-files-on-a-public-path)
  - [5.x to 6.x Upgrade note](#5x-to-6x-upgrade-note)
  - [JavaScript to UnityScript types](#havaScript-to-unityScript-types)
- [Contributing](#contributing)

<br/><br/><br/>

# Installation

Install using npm. Make sure you download the release matching with your Unity version. I try to update this plugin in case of need as fast as possible. Check the [releases on GitHub](https://github.com/jeffreylanters/react-unity-webgl/releases) for the corresponding version or [view on NPM](https://www.npmjs.com/package/react-unity-webgl).

```sh
$ npm install react-unity-webgl
```

<br/><br/><br/>

# Usage

To get started import the default Unity class from react-unity-webgl and include it in your render while giving the public path to your src and loader files. [Best practices for adding the src and loader files on a public path](#best-practices-for-adding-the-src-and-loader-files-on-a-public-path).

```jsx
import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.unityContent = new UnityContent(
      "MyGame/Build.json",
      "MyGame/UnityLoader.js"
    );
  }
  render() {
    return <Unity unityContent={this.unityContent} />;
  }
}
```

## Optional attributes

### Width and height

The default width and height is 100%

```js
<Unity ... width="500px" height="350px" />
<Unity ... width="50%" height="50%" />
```

### Tracking progression

The loading progression of the Unity player will be a value between 0 and 1

```js
<Unity ... onProgress={ this.onProgress } />
onProgress (progression) {
  console.log (`Loading ${(progression * 100)} % ...`)
  if (progression === 1)
    console.log (`Loading done!`)
}
```

### Modules

Overrides the module object

```js
this.myCustomModule = { ... }
<Unity ... module={ this.myCustomModule } />
```

### Fullscreen

Enables or disabled the fullscreen mode.

```js
import { SetFullscreen } from "react-unity-webgl";
SetFullscreen(true); // enabled fullscreen
SetFullscreen(false); // disables fullscreen
```

<br/><br/><br/>

# Calling Unity scripts functions from JavaScript in React

Sometimes you need to send some data or notification to the Unity script from the browser’s JavaScript. The recommended way of doing it is to call methods on GameObjects in your content. To get started import the class UnityEvent from react-unity-webgl.

```js
UnityEvent((objectName: String), (methodName: String));
```

Where objectName is the name of an object in your scene; methodName is the name of a method in the script, currently attached to that object. When you've created a new UnityEvent, you can call the 'emit' function to fire it into Unity. You can pass an optional parameter value.

```js
import React from "react";
import { UnityEvent } from "react-unity-webgl";

export class App extends React.Component {
  constructor() {
    this.spawnEnemies = new UnityEvent("SpawnBehaviour", "SpawnEnemies");
  }
  onClickSpawnEnemies(count) {
    if (this.spawnEnemies.canEmit() === true) this.spawnEnemies.emit(count);
  }
  render() {
    return (
      <div onClick={this.onClickSpawnEnemies.bind(this, 5)}>
        Click to Spawn 5 Enemies
      </div>
    );
  }
}
```

While in Unity the following script is attached the a game object named 'SpawnBehaviour'.

```cs
using UnityEngine;

public class SpawnController: MonoBehaviour {
  public void SpawnEnemies (int count) {
    Debug.Log (string.Format ("Spawning {0} enemies", count));
  }
}
```

<br/><br/><br/>

# Calling JavaScript functions in React from Unity scripts

We also allow you to call JavaScript functions within React from the Unity Content. To get started import the function RegisterExternalListener from react-unity-webgl.

```js
RegisterExternalListener (methodName: String, callback: Function): void;
```

Where methodName is the name of a method in your JSLib, this method will be binded to the current browser ReactUnityWebGL object so you can refer to it in your JSLib; callback will be a function, which takes one parameter with the value passed by your content. Note that it is recommended to register the callbacks before loading the Unity content. For example:

```js
import React from "react";
import { RegisterExternalListener } from "react-unity-webgl";

export class App extends React.Component {
  constructor() {
    RegisterExternalListener("OpenMenu", this.openMenu.bind(this));
  }
  openMenu(menuId) {
    this.setState({
      menuId: menuId
    });
  }
}
```

In order to use the function, you have to create a JSLib file to bind the communication. The listener registered in React is now available in the ReactUnityWebGL object in any JSLib file. You can now create a JSLib file and get started. `Assets/Plugins/WebGL/MyPlugin.jslib`.

```js
mergeInto(LibraryManager.library, {
  OpenMenu: function(menuId) {
    ReactUnityWebGL.OpenMenu(menuId);
  }
});
```

Now you can make the OpenMenu function your just made in the JSLib available in any C-Sharp script by exposing it as following.

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

<br/><br/><br/>

# Notes

## Best practices for adding the src and loader files on a public path

Make sure your Unity build is in your public folder, this is due to the component **and** Unity itself will load files in Runtime and not Compile/Bundle time. The public folder means that the folder should be accesible via a public web adress. The path within your `src` and `loader` should be relative to the html file your app is running in.

## 5.x to 6.x Upgrade note

When upgrading from 5.x to 6.x, make sure you add the `loader` prop to the Unity component and remove the script tag from your HTML page refering to the UnityLoader.js file. See [Usage](#usage) for further details.

## JavaScript to UnityScript types

Simple numeric types can be passed to JavaScript in function parameters without requiring any conversion. Other data types will be passed as a pointer in the emscripten heap (which is really just a big array in JavaScript). For strings, you can use the Pointer*stringify helper function to convert to a JavaScript string. To return a string value you need to call \_malloc* to allocate some memory and the writeStringToMemory helper function to write a JavaScript string to it. If the string is a return value, then the il2cpp runtime will take care of freeing the memory for you. For arrays of primitive types, emscripten provides different ArrayBufferViews into it’s heap for different sizes of integer, unsigned integer or floating point representations of memory: HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64. To access a texture in WebGL, emscripten provides the GL.textures array which maps native texture IDs from Unity to WebGL texture objects. WebGL functions can be called on emscripten’s WebGL context, GLctx.

<br/><br/><br/>

# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue with the owners of this repository before making a change. Before commiting, please compile your code using `npm run compile` and open a pull request. Thank you very much!
