<div align="center">

<img src="https://raw.githubusercontent.com/elraccoone/react-unity-webgl/master/.github/WIKI/logo.png" height="100px">

# React Unity WebGL

[![license](https://img.shields.io/badge/license-Apache_2.0-red.svg?style=for-the-badge)]()
[![npm](https://img.shields.io/npm/v/react-unity-webgl.svg?style=for-the-badge)]()
[![npm](https://img.shields.io/badge/build-passing-brightgreen.svg?style=for-the-badge)]()
<br/>
[![npm](https://img.shields.io/github/stars/elraccoone/react-unity-webgl.svg?style=for-the-badge&color=fe8523)]()
[![npm](https://img.shields.io/npm/dt/react-unity-webgl.svg?style=for-the-badge)]()
[![npm](https://img.shields.io/bundlephobia/minzip/react-unity-webgl?style=for-the-badge&label=size)]()

When building content for the web, you might need to communicate with elements on a webpage. Or you might want to implement functionality using Web APIs which Unity does not currently expose by default. In both cases, you need to directly interface with the browser’s JavaScript engine. React Unity WebGL provides an easy solution for embedding Unity WebGL builds in your React application, with two-way communication between your React and Unity application with advanced API's.

**&Lt;**
[**Documentation**](#documentation) &middot;
[**Test Environment**](https://github.com/jeffreylanters/react-unity-webgl-test) &middot;
[**Buy me a Coffee**](https://jeffreylanters.nl/sponsor) &middot;
[**Discussion Board**](https://github.com/elraccoone/react-unity-webgl/discussions)
**&Gt;**

<br/><br/>

[![npm](https://img.shields.io/badge/sponsor_the_project-donate-E12C9A.svg?style=for-the-badge)](https://jeffreylanters.nl/sponsor)

Hi! My name is Jeffrey Lanters, thanks for visiting! This package is an open source hobby project with ongoing development. A result of a long road and endless fight with Unity's updates since 2017, full of sleepless nights, working after hours, and busy weekends. If you're using this module for production, please consider donating to support the project. Thank you!

**&Lt;**
**Made with &hearts; by Jeffrey Lanters**
**&Gt;**

<br/><br/>

</div>

# Installation

Install using npm for your JavaScript or TypeScript React Project. Make sure you download the package version corresponding with your Unity version. I try to update this plugin in case of need as fast as possible. Please keep in mind that some documentation in the readme may not be accurate when using an older version of this module, visit the [legacy documentation](https://github.com/elraccoone/react-unity-webgl/tree/master/.github/LEGACY_DOCUMENTATION) to see older versions of the Wiki.

```sh
$ npm install react-unity-webgl@8.x  # For Unity 2020 and 2021
$ npm install react-unity-webgl@7.x  # For Unity 2018 and 2019 (LTS)
$ npm install react-unity-webgl@6.x  # For Unity 2017 (LTS)
$ npm install react-unity-webgl@5.x  # For Unity 5.6^ (LTS)
```

# Documentation

Welcome to the React Unity WebGL Documentation! My name is Jeffrey and I'm here to help you build your awesome games to the web. In the table below you'll find everything there is you'll need to know when using the module. If you'll need help, feel free to open a new [discussion](https://github.com/elraccoone/react-unity-webgl/discussions), when you want to contribute or think you've found a problem, feel free to open a new [issue](https://github.com/elraccoone/react-unity-webgl/issues). Like what you see? Please consider [Starring this repository](https://github.com/elraccoone/react-unity-webgl/stargazers)! Happy coding.

- [Getting Started](#getting-started)
- [Communication from React to Unity](#communication-from-react-to-unity)
- [Communication from Unity to React](#communication-from-unity-to-react)
- [Tracking the loading progression](#tracking-the-loading-progression)
- [Handeling on when the Application is loaded](#handeling-on-when-the-application-is-loaded)
- [Entering or Leaving Fullscreen](#entering-or-leaving-fullscreen)
- [Adding Styles to the Canvas Element](#adding-styles-to-the-canvas-element)
- [Setting the Canvas's ClassName](#setting-the-canvass-classname)
- [Device Pixel Ratio and Retina Support](#device-pixel-ratio-and-retina-support)
- [Tab Index and Input Keyboard Capturing](#tab-index-and-input-keyboard-capturing)
- [Catching Runtime errors](#catching-runtime-errors)
- [Unmounting, Unloading and Quitting](#unmounting-unloading-and-quitting)
- [Defining the Streaming Assets URL](#defining-the-streaming-assets-url)
- [Overwriting the Unity Modules](#overwriting-the-unity-modules)
- [Providing Application Meta Data](#providing-application-meta-data)
- [Getting a Reference to the Unity Canvas](#getting-a-reference-to-the-unity-canvas)
- [Change the Render Size of WebGL Canvas](#change-the-render-size-of-webgl-canvas)
- [JavaScript to UnityScript types](#javascript-to-unityscript-types)

## Getting Started

It's easy and quick to get your first React Unity project up-and-running. Just make sure you have your Unity WebGL build ready, and have your React project all set up. There are no specific React requirements, any project will do. If it's the first time working with React, I recommend checking out [Create React App](https://reactjs.org/docs/create-a-new-react-app.html). Both JavaScript and TypeScript are compatible.

Get started by import the Unity and Unity Context classes from the module. The Unity Context model will house all of your configuration, event listeners and references. Create a new Unity Context Object, pass along the paths to your Unity build and assign it to the Unity component in your Render Method. A basic implementation should look something like this.

```jsx
import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

const App = () => {
  return <Unity unityContext={unityContext} />;
};
```

## Communication from React to Unity

> Available since version 5.6.1

Sending messages from React to Unity is done using the Send method available via the Unity Context instance. The Send Method is similar to the SendMessage Method found internally in Unity.

The Method will invoke a public Method on an active GameObject in your Scene. Where gameObjectName is the name of an object in your scene; methodName is the name of a method in the script, currently attached to that object; value can be a string, a number, boolean or not defined at all.

```ts
function send(
  gameObjectName: string,
  methodName: string,
  parameter?: string | number | boolean
): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example a button is added to the Render. When it's being clicked, a method is invoked telling the Unity Context to send a message to a Game Object named "GameController" to invoke the method "SpawnEnemies" with an Int parameter.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function spawnEnemies(amount) {
  unityContext.send("GameController", "SpawnEnemies", amount);
}

const App = () => {
  return (
    <div>
      <button onClick={() => spawnEnemies(100)}>Spawn!</button>
      <Unity unityContext={unityContext} />
    </div>
  );
};
```

```csharp
// File: EnemyController.cs
// Attached to GameObject "GameController"

public class EnemyController : MonoBehaviour {
  public void SpawnEnemies (int amount) {
    Debug.Log ($"Spawning {amount} enemies!");
  }
}
```

## Communication from Unity to React

> Available since version 6.0.0

Sending messages from Unity to React is done using Event Listeners via the Unity Context instance. Invoking these Event Listeners from your Unity Project is quite different.

On the React side of your project an Event Listeners can be registered to the Unity Context instance. Register the Event Listener using the "on" method as following, where "eventName" is the name of your listener, and the "eventListener" method is the Method which will be Invoked which may or may not pass along any Arguments based on your implementation.

> Keep in mind communication from Unity to React is global, so Event Listeners with the same name will overwrite one another.

> Simple numeric types can be passed to JavaScript in function parameters without requiring any conversion. Other data types will be passed as a pointer in the emscripten heap (which is really just a big array in JavaScript). For strings, you can use the Pointerstringify helper function to convert to a JavaScript string. You can read more about parameters and [JavaScript to Unityscript types](#javascript-to-unityscript-types) here.

```ts
function on(eventName: string, eventListener: Function): void;
```

In order to emit Event Listeners, a JSLib file has to be created within your Unity Project "Plugins/WebGL" directory. The React Unity WebGL module exposes a global Object which allows for the emitting of the Event Listeners. When writing your JSLib file, simply invoke the eventName as a member of the "ReactUnityWebGL" object within any method.

```js
ReactUnityWebGL[eventName: string];
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll create a new Event Listener with the event name "GameOver" which passes along a userName and an interger container the score. When the Event is emitted we'll change the State.

```jsx
// File: App.jsx

import React, { Component } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGameOver: false,
      userName: "",
      score: 0,
    };

    this.unityContext = new UnityContext({
      loaderUrl: "build/myunityapp.loader.js",
      dataUrl: "build/myunityapp.data",
      frameworkUrl: "build/myunityapp.framework.js",
      codeUrl: "build/myunityapp.wasm",
    });

    this.unityContext.on("GameOver", (userName, score) => {
      this.setState({
        isGameOver: true,
        userName: userName,
        score: score,
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.isGameOver === true && (
          <p>{`Game Over: ${this.state.userName} score: ${this.state.score}`}</p>
        )}
        <Unity unityContext={this.unityContext} />
      </div>
    );
  }
}
```

To emit the Event Listener we've just created, we'll have to create a new JSLib file within our Unity Project first. This JSLib file will be places within the "Assets/Plugins/WebGL" directory. The JSLib itself has nothing to do with this module, it is natively supported by Unity and is used for all communication between your CSharp and JavaScript in any given context.

We'll start of by creating a new method inside of our JSLib. The name of this method can be anything, but in this example we'll give it it the same name as our Event Name to keep things clean. In the body of the method, we'll emit our Event Listener by invoking a method on the "ReactUnityWebGL" object exposed by the module. All of your Event Listeners are available as a property using the Event Name on the object. We'll pass along the userName and the score. The userName has to go through the built-in "Pointer_stringify" method in order to get the value, otherwise a int pointer will be passed instead. You can read more about parameters and [JavaScript to Unityscript types](#javascript-to-unityscript-types) here.

```js
// File: MyPlugin.jslib

mergeInto(LibraryManager.library, {
  GameOver: function (userName, score) {
    ReactUnityWebGL.GameOver(Pointer_stringify(userName), score);
  },
});
```

Finally, to emit to Event Listener within your CSharp code. We're importing the JSLib using Unity's DllImporter as following. When the name of imported Method matches with the Method's name in the JSLib, you can invoke it.

> WebGL methods in general are not available in the Unity Editor. Prevent invoking these methods when the Application is not running the WebGL environment, e.g The Unity Editor.

```csharp
/// File: GameController.cs

using UnityEngine;
using System.Runtime.InteropServices;

public class GameController : MonoBehaviour {

  [DllImport("__Internal")]
  private static extern void GameOver (string userName, int score);

  public void SomeMethod () {
    GameOver ("Player1", 100);
  }
}
```

## Tracking the loading progression

> Available since version 6.0.1

While your game is being downloaded from the server and loaded into memory, you might want to display some sort of loading indicator informing the user of the progression. The built-in progression event listeners can be used for such cases. On Progress is emitted while the Unity player is being loaded. The parameter contains the progression from 0 to 1. When the game is fully loaded into memory and will start execution, the progression will hit 1. The event will invoke everytime the progression advances.

```ts
function on(
  eventName: "progress",
  eventListener: (progression: number) => void
): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll track the loading progression and show a loading indicator.

```jsx
// File: App.jsx

import React, { Component } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progression: 0,
    };

    this.unityContext = new UnityContext({
      loaderUrl: "build/myunityapp.loader.js",
      dataUrl: "build/myunityapp.data",
      frameworkUrl: "build/myunityapp.framework.js",
      codeUrl: "build/myunityapp.wasm",
    });

    this.unityContext.on("progress", (progression) => {
      this.setState({
        progression: progression,
      });
    });
  }

  render() {
    return (
      <div>
        <p>{`Loading... ${this.state.progression * 100}%`}</p>
        <Unity unityContext={this.unityContext} />
      </div>
    );
  }
}
```

## Handeling on when the Application is loaded

> Available since version 6.0.2

While your application is being downloaded from the server and loaded into memory, you might want to display some sort of overlay or loading screen. The built-in loaded event listeners can be used for such cases. On Loaded is emitted when the Unity player is loaded into memory and execution is started. Event will be invoked only once.

```ts
function on(eventName: "loaded", eventListener: () => void): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll set the games visibility to hidden until it's loaded.

```jsx
// File: App.jsx

import React, { Component } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };

    this.unityContext = new UnityContext({
      loaderUrl: "build/myunityapp.loader.js",
      dataUrl: "build/myunityapp.data",
      frameworkUrl: "build/myunityapp.framework.js",
      codeUrl: "build/myunityapp.wasm",
    });

    this.unityContext.on("loaded", () => {
      this.setState({
        isLoaded: true,
      });
    });
  }

  render() {
    return (
      <Unity
        style={{ visibility: this.state.isLoaded ? "visible" : "hidden" }}
        unityContext={this.unityContext}
      />
    );
  }
}
```

## Entering or Leaving Fullscreen

> Available since version 6.0.6

The Unity context object allows you to enable and disable the fullscreen mode of your application. Cursor locking (using Cursor.lockState) and full-screen mode are both supported in WebGL, implemented using the respective HTML5 APIs (Element.requestPointerLock and Element.requestFullscreen). These are supported in Firefox and Chrome. Safari cannot currently use full-screen and cursor locking. An implementation could look something like:

```js
function setFullscreen(enabled: boolean): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example a button is added to the Render. When it's being clicked, the application will enter fullscreen mode.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function handleOnClickFullscreen() {
  unityContext.setFullscreen(true);
}

const App = () => {
  return (
    <div>
      <button onClick={() => handleOnClickFullscreen()}>Fullscreen</button>
      <Unity unityContext={unityContext} />
    </div>
  );
};
```

## Adding Styles to the Canvas Element

> Available since version 8.2.0

The style tag allows for adding inline CSS for styling the component. The style's properties will be assigned directly onto the actual canvas.

The style attribute accepts a JavaScript object with camelCased properties rather than a CSS string. This is consistent with the DOM style JavaScript property, is more efficient, and prevents XSS security holes. React will automatically append a “px” suffix to certain numeric inline style properties. If you want to use units other than “px”, specify the value as a string with the desired unit.

```tsx
<Unity style={CSSProperties} />
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll set the canvas's width to 100%, and the height to a fixed 950px.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

const App = () => {
  return (
    <Unity
      unityContext={unityContext}
      style={{
        height: "100%",
        width: 950,
        border: "2px solid black",
        background: "grey",
      }}
    />
  );
};
```

## Setting the Canvas's ClassName

> Available since version 6.0.1

You can add an optional class name to the Unity component. The class name attribute specifies one or more class names for the HTML Canvas Element. The class attribute is mostly used to point to a class in a style sheet. However, it can also be used by a JavaScript (via the HTML DOM) to make changes to HTML elements with a specified class.

```tsx
<Unity className={string} />
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll set the canvas's class name to a spefic value.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

const App = () => {
  return <Unity unityContext={unityContext} className={"game-canvas"} />;
};
```

## Device Pixel Ratio and Retina Support

> Available since version 8.1.1 and requires Unity 2020.1 or newer

The Canvas can appear too blurry on retina screens. The device pixel ratio determines how much extra pixel density should be added to allow for a sharper image. The value will be used as a multiplier to the actual canvas scale and will have a big impact on the performance of your application.

```tsx
<Unity devicePixelRatio={number} />
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll set the canvas's device pixel ratio to a value of "2" for sharper images on Retina screens.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

const App = () => {
  return <Unity unityContext={unityContext} devicePixelRatio={2} />;
};
```

## Tab Index and Input Keyboard Capturing

By default, Unity WebGL builds capture the keyboard as soon as it's loaded. This means that all keyboard input on your React Application is captured by the Unity Application instead. Doing so will result in a focus and blur on all keyboard events when clicking on, or around the Unity Application. Implementing the tabIndex of the element mitigates this issue and allows for other elements to be selected.

```tsx
<Unity tabIndex={number} />
```

In order for this to work, Capture All Keyboard Input has to be set to false within your Unity Application. Preferably as soon as the Application is loaded. This property determines whether keyboard inputs are captured by WebGL. If this is enabled (default), all inputs will be received by the WebGL canvas regardless of focus, and other elements in the webpage will not receive keyboard inputs. You need to disable this property if you need inputs to be received by other html input elements.

```csharp
WebGLInput.captureAllKeyboardInput = false;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll set the canvas's tab index to a specific value allowing other elements such as HTML Input Elements and HTML TextArea Elements to capture input too.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

const App = () => {
  return <Unity unityContext={unityContext} tabIndex={1} />;
};
```

```csharp
/// File: GameController.cs

using UnityEngine;

public class GameController : MonoBehaviour {
  private void Start () {
#if !UNITY_EDITOR && UNITY_WEBGL
    WebGLInput.captureAllKeyboardInput = false;
#endif
  }
}
```

## Catching Runtime errors

> Available since version 7.0.5

When your Applications run into a runtime error, you might want to display your players any kind of error screen, or debug the problem yourself. The built-in error event listeners can be used for such cases. On Error is emitted while the Unity Player runs into an error. This is most likely a runtime error. The error details and stack trace are passed along via the parameter.

> Keep in mind that Unity WebGL production builds contain obfuscation code which might be hard to debug.

```ts
function on(eventName: "error", eventListener: (message: string) => void): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll display the application until an error occurs, then we'll unmount the application and show the error message instead.

```jsx
// File: App.jsx

import React, { Component } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      didError: false,
      errorMessage: "",
    };

    this.unityContext = new UnityContext({
      loaderUrl: "build/myunityapp.loader.js",
      dataUrl: "build/myunityapp.data",
      frameworkUrl: "build/myunityapp.framework.js",
      codeUrl: "build/myunityapp.wasm",
    });

    this.unityContext.on("error", (message) => {
      this.setState({
        didError: true,
        errorMessage: message,
      });
    });
  }

  render() {
    return this.state.didError === true ? (
      <div>{`Oops, that's an error ${this.state.errorMessage}`}</div>
    ) : (
      <Unity unityContext={this.unityConext} />
    );
  }
}
```

## Unmounting, Unloading and Quitting

> Available since version 8.0.0 and requires Unity 2020.1 or newer

The quitted event is emitted in two cases, when the Unity component is unmounted, and when Application.Quit is invoked from within your Unity Application. In both cases the Unity Player will be unloaded from memory.

```ts
function on(eventName: "quitted", eventListener: () => void): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll listen to the event but don't act on it yet.

```jsx
// File: App.jsx

import React, { Component } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      didError: false,
      errorMessage: "",
    };

    this.unityContext = new UnityContext({
      loaderUrl: "build/myunityapp.loader.js",
      dataUrl: "build/myunityapp.data",
      frameworkUrl: "build/myunityapp.framework.js",
      codeUrl: "build/myunityapp.wasm",
    });

    this.unityContext.on("quitted", () => {});
  }

  render() {
    return <Unity unityContext={this.unityConext} />;
  }
}
```

## Defining the Streaming Assets URL

> Available since version 6.1.0

When using Streaming Assets, a URL (or Path) can be defined where your Unity Application can find these files. The URL will be used as the base of every Streaming Asset request.

```tsx
<IUnityConfig>{
  streamingAssetsUrl: string,
};
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll set the streaming assets url to the "streamingassets" directory.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
  streamingAssetsUrl: "streamingassets",
});

const App = () => {
  return <Unity unityContext={unityContext} />;
};
```

## Overwriting the Unity Modules

> Available since version 6.1.1

Overwrites the Unity Modules.

```tsx
<IUnityConfig>{
  module: Object,
};
```

#### Example implementation

A basic implementation could look something like this.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
  module: {},
});

const App = () => {
  return <Unity unityContext={unityContext} />;
};
```

## Providing Application Meta Data

> Available since version 8.0.1

Sets the application meta data.

```tsx
<IUnityConfig>{
  productName: string,
  productVersion: string,
  companyName: string,
};
```

#### Example implementation

A basic implementation could look something like this.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
  productName: "My Game",
  productVersion: "1.0.0",
  companyName: "El Raccoone",
});

const App = () => {
  return <Unity unityContext={unityContext} />;
};
```

## Getting a Reference to the Unity Canvas

> Available since version 8.2.3

To get a reference to the canvas, we have to wait for the Unity Instance to be loaded, and the Canvas to be appended to the DOM. This is where the Canvas event comes in. The Canvas event is invoked on this exact moment and passes along a reference to the actual Unity Canvas.

```ts
function on(
  eventName: "canvas",
  eventListener: (canvas: HTMLCanvasElement) => void
): void;
```

#### Example implementation

A basic implementation could look something like this.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

unityContext.on("canvas", (canvas) => {
  canvas.getContext("webgl");
});

const App = () => {
  return <Unity unityContext={unityContext} />;
};
```

## Change the Render Size of WebGL Canvas

> Available since version 8.2.3 and requires Unity 2021.1 beta 8 or newer

To customize the WebGL canvas target render size instead of requiring it to always match 1:1 with the High DPI CSS size of the canvas, the match WebGL to canvas size flag can be set to false. Allowing full control over the Canvas Render size using JavaScript.

```jsx
<Unity matchWebGLToCanvasSize={boolean} />
```

#### Example implementation

A basic implementation could look something like this. In this example the canvas will be styled to have a width and height of 100 pixels while setting the actual canvas's renderer size to a width of 100 pixels, and a height of 50 pixels resulting in the image to get stretched.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

unityContext.on("canvas", (canvas) => {
  canvas.width = 100;
  canvas.height = 50;
});

const App = () => {
  return (
    <Unity
      unityContext={unityContext}
      matchWebGLToCanvasSize={false}
      style={{ width: "100px", height: "100px" }}
    />
  );
};
```

## JavaScript to UnityScript types

Simple numeric types can be passed to JavaScript in function parameters without requiring any conversion. Other data types will be passed as a pointer in the emscripten heap (which is really just a big array in JavaScript). For strings, you can use the Pointerstringify helper function to convert to a JavaScript string.

To return a string value you need to call \_malloc to allocate some memory and the writeStringToMemory helper function to write a JavaScript string to it. If the string is a return value, then the il2cpp runtime will take care of freeing the memory for you.

For arrays of primitive types, emscripten provides different ArrayBufferViews into it’s heap for different sizes of integer, unsigned integer or floating point representations of memory: HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64. To access a texture in WebGL, emscripten provides the GL.textures array which maps native texture IDs from Unity to WebGL texture objects. WebGL functions can be called on emscripten’s WebGL context, GLctx.

#### Example implementation

A basic implementation could look something like this. In this example a series of methods is merged into the Unity library making this methods availble in CSharp. Each of these methods contain an example on how to handle specific types of data. No worries, the methods used for the conversion such as "Pointer_stringify" and "HEAPF32" are available natively.

```js
// File: MyPlugin.jslib

mergeInto(LibraryManager.library, {
  GameOver: function () {
    ReactUnityWebGL.GameOver();
  },
  NextWave: function (waveNumber) {
    ReactUnityWebGL.NextWave(waveNumber);
  },
  ShowPopup: function (text) {
    ReactUnityWebGL.ShowPopup(Pointer_stringify(text));
  },
  SubmitScores: function (scoresFloatArray, arraySize) {
    var scores = [];
    for (var i = 0; i < arraySize; i++)
      scores.push(HEAPF32[(scoresFloatArray >> 2) + arraySize]);
    ReactUnityWebGL.SubmitScores(scores);
  },
});
```

# Contribution and Development

When contributing to this repository, please first discuss the change you wish to make via issue with the owners of this repository before making a change. Before commiting, please compile your code using npm run compile and open a pull request.

**Before submitting a pull request,** please make sure the following is done:

- Fork [the repository](https://github.com/elraccoone/react-unity-webgl) and create your branch from `master`.
- Run `npm install` in the repository root.
- Ensure the [test environment](https://github.com/jeffreylanters/react-unity-webgl-test) passes using `npm start` on the library.
- Format your code with [prettier](https://github.com/prettier/prettier).
- Make sure your code lints (`ts lint`).
- Typecheck all of your changes and make sure JSDocs are provided.
- If you haven't already, complete the CLA.

#### Development and test cycle

If you want to modify this package and iteratively test it in inside your application, use the following steps while you're inside the directory of your own application:

> Do not use a symlink-based technique (e.g. with the "npm link" command) because [npm link breaks libraries that are based on React](https://dev.to/vcarl/testing-npm-packages-before-publishing-h7o).

```sh
cd ../react-unity-webgl/
npm pack
cd ../your-app
npm remove react-unity-webgl
npm install ../react-unity-webgl/react-unity-webgl-x.y.z.tgz
```

The "npm pack" command creates a .tgz file exactly the way it would if you were going to publish the package to npm. You can use that .tgz file to install it in your app. That way you can be sure that everything works exactly as it will do when you publish the package, later.

This package here _must not_ have a dependency on React, only a dev dependency on @types/react. Otherwise, the users of this package might install two different versions of React which will lead to problems.

Thanks for your contribution!

# Donators

This package is an open source hobby project with ongoing development. A result of a long road and endless fight with Unity's updates since 2017, full of sleepless nights, working after hours, and busy weekends. If you're using this module for production, please consider [donating](https://jeffreylanters.nl/sponsor) to support the project. Thank you!

[<img src="https://avatars2.githubusercontent.com/u/28768645?s=460&v=4" height="50" />](https://github.com/mattdeitke)
[<img src="https://i.ibb.co/w43CV2q/Unknown.jpg" height="50" />](https://www.callit.com.au)
[<img src="https://avatars2.githubusercontent.com/u/2016308?s=460&v=4" width="50" height="50" />](https://github.com/mrniket)
[<img src="https://avatars3.githubusercontent.com/u/20756439?s=460&v=4" width="50" height="50" />](https://github.com/webbertakken)
[<img src="https://avatars3.githubusercontent.com/u/1134186?s=460&v=4" width="50" height="50" />](https://github.com/hawksprite)
