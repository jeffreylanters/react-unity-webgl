<div align="center">

![readme splash](https://raw.githubusercontent.com/jeffreylanters/react-unity-webgl/main/.github/WIKI/repository-readme-splash.png)

[![license](https://img.shields.io/badge/license-Apache_2.0-red.svg?style=for-the-badge)](https://github.com/jeffreylanters/react-unity-webgl/blob/main/LICENSE.md)
[![npm](https://img.shields.io/npm/v/react-unity-webgl.svg?style=for-the-badge)](https://www.npmjs.com/package/react-unity-webgl)
[![build](https://img.shields.io/github/workflow/status/jeffreylanters/react-unity-webgl/Pre-Compile%20and%20Lint?style=for-the-badge)](https://github.com/jeffreylanters/react-unity-webgl/actions)
[![deployment](https://img.shields.io/github/deployments/jeffreylanters/react-unity-webgl/Node%20Package%20Registry?style=for-the-badge)](https://github.com/jeffreylanters/react-unity-webgl/deployments/activity_log?environment=Node+Package+Registry)
[![stars](https://img.shields.io/github/stars/jeffreylanters/react-unity-webgl.svg?style=for-the-badge&color=fe8523&label=stargazers)](https://github.com/jeffreylanters/react-unity-webgl/stargazers)
[![downloads](https://img.shields.io/npm/dt/react-unity-webgl.svg?style=for-the-badge&color=40AA72)](https://www.npmtrends.com/react-unity-webgl)
[![size](https://img.shields.io/bundlephobia/minzip/react-unity-webgl?style=for-the-badge&label=size)](https://bundlephobia.com/result?p=react-unity-webgl)
[![sponsors](https://img.shields.io/github/sponsors/jeffreylanters?color=E12C9A&style=for-the-badge)](https://github.com/sponsors/jeffreylanters)
[![donate](https://img.shields.io/badge/donate-paypal-F23150?style=for-the-badge)](https://paypal.me/jeffreylanters)

When building content for the web, you might need to communicate with elements on a webpage. Or you might want to implement functionality using Web APIs which Unity does not currently expose by default. In both cases, you need to directly interface with the browser’s JavaScript engine. React Unity WebGL provides an easy solution for embedding Unity WebGL builds in your React application, with two-way communication between your React and Unity application with advanced API's.

[**Documentation**](#documentation) &middot;
[**Live Demo**](https://jeffreylanters.github.io/react-unity-webgl-tests/) &middot;
[**Test Environment**](https://github.com/jeffreylanters/react-unity-webgl-tests) &middot;
[**Buy me a Coffee**](https://github.com/sponsors/jeffreylanters) &middot;
[**Discussion Board**](https://github.com/jeffreylanters/react-unity-webgl/discussions)

**Made with &hearts; by Jeffrey Lanters**

</div>

### A quick word

Hi there! I would like to say one more thing before you start bringing your awesome games to the web. My name is Jeffrey, I'm a Unity and Web developer with a passion for Open Source. The project you're looking at right now is one of my hobby projects. Maintaining and building this project is something I do in my spare time, and I have been doing so for the last 4 years. React-Unity-WebGL will always remain free, but if you are able to, I would appreciate it if you consider [sending a donation](https://paypal.me/jeffreylanters) or [becoming a sponsor](https://github.com/sponsors/jeffreylanters) to help me keep this project going.

Thanks for your time, happy coding!

# Installation

Install using npm for your JavaScript or TypeScript React Project. Make sure you download the package version corresponding with your Unity version. I try to update this plugin in case of need as fast as possible. Please keep in mind that some documentation in the readme may not be accurate when using an older version of this module, head over to an older release tag in order to see older versions of the documentation.

```sh
$ npm install react-unity-webgl@8.x  # For Unity 2020 and 2021 (Current)
$ npm install react-unity-webgl@7.x  # For Unity 2018 and 2019 (Active LTS)
$ npm install react-unity-webgl@6.x  # For Unity 2017 (Maintenance LTS)
$ npm install react-unity-webgl@5.x  # For Unity 5.6^ (Maintenance LTS)
```

# Documentation

Welcome to the React Unity WebGL Documentation! My name is Jeffrey and I'm here to help you build your awesome games to the web. In the table below you'll find everything there is you'll need to know when using the module. If you'll need help, feel free to open a new [discussion](https://github.com/jeffreylanters/react-unity-webgl/discussions), when you want to contribute or think you've found a problem, feel free to open a new [issue](https://github.com/jeffreylanters/react-unity-webgl/issues). Like what you see? Please consider [Starring this repository](https://github.com/jeffreylanters/react-unity-webgl/stargazers)! Happy coding.

- [Getting Started](#getting-started)
- [Understanding the Unity Context Object](#understanding-the-unity-context-object)
- [Communication from React to Unity](#communication-from-react-to-unity)
- [Communication from Unity to React](#communication-from-unity-to-react)
- [Tracking the loading progression](#tracking-the-loading-progression)
- [Handeling on when the Application is loaded](#handeling-on-when-the-application-is-loaded)
- [Entering or Leaving Fullscreen](#entering-or-leaving-fullscreen)
- [Adding Styles to the Canvas Element](#adding-styles-to-the-canvas-element)
- [Setting the Canvas's ClassName](#setting-the-canvass-classname)
- [Device Pixel Ratio and Retina Support](#device-pixel-ratio-and-retina-support)
- [Tab Index and Input Keyboard Capturing](#tab-index-and-input-keyboard-capturing)
- [Requesting Canvas Pointer Locking](#requesting-canvas-pointer-locking)
- [Catching Runtime and Loading Errors](#catching-runtime-and-loading-errors)
- [Receiving Internal and Debug Log Messages](#receiving-internal-and-debug-log-messages)
- [Unmounting Unloading and Quitting](#unmounting-unloading-and-quitting)
- [Removing Specific Event Listeners](#removing-specific-event-listeners)
- [Removing All Event Listeners](#removing-all-event-listeners)
- [Defining the Streaming Assets URL](#defining-the-streaming-assets-url)
- [Configuring the WebGL Rendering Context](#configuring-the-webgl-rendering-context)
- [Providing Application Meta Data](#providing-application-meta-data)
- [Getting a Reference to the Unity Canvas](#getting-a-reference-to-the-unity-canvas)
- [Change the Render Size of WebGL Canvas](#change-the-render-size-of-webgl-canvas)
- [Taking Screenshots of the Canvas](#taking-screenshots-of-the-canvas)
- [Providing an external Memory File](#providing-an-external-memory-file)
- [Providing Debugging Symbols](#providing-debugging-symbols)
- [JavaScript to UnityScript types](#javascript-to-unityscript-types)
- [Creating Unity WebGL builds](#creating-unity-webgl-builds)
- [Contribution and Development](#contribution-and-development)

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

function App() {
  return <Unity unityContext={unityContext} />;
}
```

## Understanding the Unity Context Object

When wanting to render a Unity Application within your React Application, you will need to pass along the Unity Context Object to the Unity Component. The Unity Context Object is the heart of the implementation. This is were all of your configuration, event listeners and references will be stored.

When passing the Unity Context Object to the Unity Component, it will take the configuration and starts loading the required resources in order to render your Unity Application. During this process, the Unity Context Object will be updated with the Unity Application's state and will invoke various events which can all be found in the documentation.

> Make sure to create your Unity Context object either somewhere outside of your component, or in a component did mount cycle to prevent it from being created multiple times thus losing a reference to the Unity Instance.

When creating a new Unity Context object, you'll need to pass a Unity Config boject. A most basic Unity Config consists the following four properties. These four properties are all URLs to the required Unity Build resources.

- The **Loader URL**, this is a JavaScript file which contains the Unity Engine bootstrapping code. This file is required to load the Unity Engine and start the initialization process.
- The **Framework URL**, this is a JavaScript file which contains the Runtime and Plugin code. This file is responsible for running the actual Unity Application.
- The **Data URL**, this is a JSON file which contains the initial Unity Application state including your Assets and Scenes. This file can get big really fast so try to optimize your game's assets as much as possible. Try using both building and runtime compression techniques and usefull packages such as sprite atlasses.
- The **Code URL**, this a Web Assembly binary file containg native code.

There are many more properties you can pass to the Unity Config object. These properties are all optional and can be found in the documentation.

Sounds complicated? No worries, you don't need to remember any of the meanings behind these files. The module will take care of all of this for you. Just add the paths to the files to the Unity Context, sit back and enjoy!

> All of the URLs, including the ones mentioned above, are due to their enormous size **NOT loaded into your bundle**. You should place these files in a public directory within your project or use a CDN. This means the files behind these URLs are loaded during runtime and should be accessible by a the browser via a public URL.

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

function App() {
  function spawnEnemies() {
    unityContext.send("GameController", "SpawnEnemies", 100);
  }

  return (
    <div>
      <button onClick={spawnEnemies}>Spawn a bunch!</button>
      <Unity unityContext={unityContext} />
    </div>
  );
}
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

> Available since version 6.0.0, refactored in 8.6.0

Sending messages from Unity to React is done using Event Listeners via the Unity Context instance. Invoking these Event Listeners from your Unity Project is quite different.

On the React side of your project an Event Listeners can be registered to the Unity Context instance. Register the Event Listener using the "on" method as following, where "eventName" is the name of your listener, and the "eventListener" method is the Method which will be Invoked which may or may not pass along any Arguments based on your implementation.

> Keep in mind communication from Unity to React is global, so Event Listeners with the same name will will be invoked on all Unity Instances.

> Simple numeric types can be passed to JavaScript in function parameters without requiring any conversion. Other data types will be passed as a pointer in the emscripten heap (which is really just a big array in JavaScript). For strings, you can use the Pointerstringify helper function to convert to a JavaScript string. You can read more about parameters and [JavaScript to Unityscript types](#javascript-to-unityscript-types) here.

```ts
function on(eventName: string, eventListener: Function): void;
```

In order to dispatch Event Listeners, a JSLib file has to be created within your Unity Project "Plugins/WebGL" directory. The React Unity WebGL module exposes a global method to the window which allows for the dispatchment of the Event Listeners. When writing your JSLib file, simply invoke the eventName using the global methpd "dispatchReactUnityEvent" with an optional parameter.

```ts
function dispatchReactUnityEvent(eventName: string, ...parameters: any);
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll create a new Event Listener with the event name "GameOver" which passes along a userName and an interger container the score. When the Event is emitted we'll change the State.

```jsx
// File: App.jsx

import React, { useState, useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [userName, setUserName] = useState("");
  const [score, setScore] = useState(0);

  useEffect(function () {
    unityContext.on("GameOver", function (userName, score) {
      setIsGameOver(true);
      setUserName(userName);
      setScore(score);
    });
  }, []);

  return (
    <div>
      {isGameOver === true && <p>{`Game Over! ${userName} ${score} points`}</p>}
      <Unity unityContext={unityContext} />
    </div>
  );
}
```

To emit the Event Listener we've just created, we'll have to create a new JSLib file within our Unity Project first. This JSLib file will be places within the "Assets/Plugins/WebGL" directory. The JSLib itself has nothing to do with this module, it is natively supported by Unity and is used for all communication between your CSharp and JavaScript in any given context.

We'll start of by creating a new method inside of our JSLib. The name of this method can be anything, but in this example we'll give it it the same name as our Event Name to keep things clean. In the body of the method, we'll emit our Event Listener by invoking the global method "dispatchReactUnityEvent" exposed by this module. All of your Event Listeners are available using the Event Name as the first parameter. We'll pass along the userName and the score. The userName has to go through the built-in "Pointer_stringify" method in order to get the value, otherwise a int pointer will be passed instead. You can read more about parameters and [JavaScript to Unityscript types](#javascript-to-unityscript-types) here.

```js
// File: MyPlugin.jslib

mergeInto(LibraryManager.library, {
  GameOver: function (userName, score) {
    window.dispatchReactUnityEvent(
      "GameOver",
      Pointer_stringify(userName),
      score
    );
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
#if UNITY_WEBGL == true && UNITY_EDITOR == false
    GameOver ("Player1", 100);
#endif
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

import React, { useState, useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  const [progression, setProgression] = useState(0);

  useEffect(function () {
    unityContext.on("progress", function (progression) {
      setProgression(progression);
    });
  }, []);

  return (
    <div>
      <p>Loading {progression * 100} percent...</p>
      <Unity unityContext={unityContext} />
    </div>
  );
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

import React, { useState, useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(function () {
    unityContext.on("loaded", function () {
      setIsLoaded(true);
    });
  }, []);

  return (
    <Unity
      style={{ visibility: isLoaded ? "visible" : "hidden" }}
      unityContext={unityContext}
    />
  );
}
```

## Entering or Leaving Fullscreen

> Available since version 6.0.6

The Unity context object allows you to enable and disable the fullscreen mode of your application. Cursor locking (using Cursor.lockState) and full-screen mode are both supported in WebGL, implemented using the respective HTML5 APIs (Element.requestPointerLock and Element.requestFullscreen). These are supported in Firefox and Chrome. Safari cannot currently use full-screen and cursor locking. An implementation could look something like:

```ts
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

function App() {
  function handleOnClickFullscreen() {
    unityContext.setFullscreen(true);
  }

  return (
    <div>
      <button onClick={handleOnClickFullscreen}>Fullscreen</button>
      <Unity unityContext={unityContext} />
    </div>
  );
}
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

function App() {
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
}
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

function App() {
  return <Unity unityContext={unityContext} className={"game-canvas"} />;
}
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

function App() {
  return <Unity unityContext={unityContext} devicePixelRatio={2} />;
}
```

## Requesting Canvas Pointer Locking

> Available since version 8.6.0

Asynchronously ask for the pointer to be locked on current canvas. To track the success or failure of the request, it is necessary to listen for the pointerlockchange and pointerlockerror events at the Document level.

```tsx
function requestPointerLock(): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll request a pointer lock on the click of a button.

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

function App() {
  function requestPointerLock() {
    unityContext.requestPointerLock();
  }

  return (
    <div>
      <button onClick={requestPointerLock}>Lock Pointer</button>
      <Unity unityContext={unityContext} />
    </div>
  );
}
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

function App() {
  return <Unity unityContext={unityContext} tabIndex={1} />;
}
```

```csharp
/// File: GameController.cs

using UnityEngine;

public class GameController : MonoBehaviour {
  private void Start () {
#if UNITY_WEBGL == true && UNITY_EDITOR == false
    WebGLInput.captureAllKeyboardInput = false;
#endif
  }
}
```

## Catching Runtime and Loading Errors

> Available since version 7.0.5

> Keep in mind that Unity WebGL production builds contain obfuscation code which might be hard to debug.

> By default Unity Alerts all errors thrown by the Unity Player. This can become very annoying, especially for an experienced web developer. Even though the module catches all of these errors, there is sadly no way to disable the Alert behaviour from outside of your Unity Build. There are two things you can do to disable the alerts, either find and replace the alert in your generated Unity Loader, or overwrite your windows alert method. I'm trying to contact Unity about this, and when a solution is available, I'll be the first to happily implement this.

When your Applications run into a runtime error, you might want to display your players any kind of error screen, or debug the problem yourself. The built-in error event listeners can be used for such cases. On Error is emitted while the Unity Player runs into an error. This is most likely a runtime error. The error details and stack trace are passed along via the parameter.

When something goes wrong during the mounting of your application, this can be caused by various reasons such as an invalid Unity Loader or undefined variable, an error event will be dispatched as well.

```ts
function on(eventName: "error", eventListener: (message: string) => void): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll display the application until an error occurs, then we'll unmount the application and show the error message instead.

```jsx
// File: App.jsx

import React, { useState, useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  const [didError, setDidError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(function () {
    unityContext.on("error", function (message) {
      setDidError(true);
      setErrorMessage(message);
    });
  }, []);

  return didError === true ? (
    <div>Oops, that's an error {errorMessage}</div>
  ) : (
    <Unity unityContext={unityConext} />
  );
}
```

## Receiving Internal and Debug Log Messages

> Available since version 8.3.0

Both the Unity Loader and your Unity Application Instance can send debug messages. The Internal messages, as commonly sent by the Unity Loader mostly contain information about the instanciation process of your Unity Application. The messages send from your Unity Application mostly consist of Debug Log messages invoked by the source of your CSharp project or any of your used modules. By default none of these messages are written to the console.

```ts
function on(eventName: "debug", eventListener: (message: string) => void): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll push all messages straight to the console.

```jsx
// File: App.jsx

import React, { useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  useEffect(function () {
    unityContext.on("debug", function (message) {
      console.log(message);
    });
  }, []);

  return <Unity unityContext={unityContext} />;
}
```

## Unmounting Unloading and Quitting

> Available since version 8.0.0 and requires Unity 2020.1 or newer

The quitted event is emitted in two cases, when the Unity component is unmounted, and when Application.Quit is invoked from within your Unity Application. In both cases the Unity Player will be unloaded from memory.

```ts
function on(eventName: "quitted", eventListener: () => void): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll listen to the event but don't act on it yet.

```jsx
// File: App.jsx

import React, { useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  useEffect(function () {
    unityContext.on("quitted", function () {});
  }, []);

  return <Unity unityContext={unityConext} />;
}
```

## Removing Specific Event Listeners

> Available since version 8.4.0

Allows the deletion of specific event listeners for both built-in and custom events. This can come in handy when unmounting your component or changing your user interface. The event listener will be removed on both the React and Unity side.

```ts
function removeEventListener(eventName: string): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll remove an event listener from the built-in on progress event, when the component will unmount.

```jsx
// File: App.jsx

import React, { useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  useEffect(function () {
    unityContext.on("progress", function (progression) {
      console.log(progression);
    });
    return function () {
      unityContext.removeEventListener("progress");
    };
  }, []);

  return <Unity unityContext={unityConext} />;
}
```

## Removing All Event Listeners

> Available since version 8.4.0

Allows the deletion of all event listeners for both built-in and custom events binded to a Unity Context. This can come in handy when unmounting your component or changing your user interface. The event listener will be removed on both the React and Unity side.

```ts
function removeAllEventListeners(): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll remove all event listeners, when the component will unmount.

```jsx
// File: App.jsx

import React, { useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  useEffect(function () {
    unityContext.on("progress", function (progression) {});
    unityContext.on("customEvent", function () {});
    return function () {
      unityContext.removeAllEventListeners();
    };
  }, []);

  return <Unity unityContext={unityConext} />;
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

function App() {
  return <Unity unityContext={unityContext} />;
}
```

## Configuring the WebGL Rendering Context

> Available since version 8.5.0

The WebGLContexAttributes allow you to configure WebGLRenderingContext creation options when passed as an additional context attributes parameter to the UnityContext. An object can be used as the WebGLContextAttributes and if the properties below are specified on it, they will be used instead of the default values. Only the options passed to the first call will apply, subsequent calls will ignore the attributes.

```tsx
<IUnityConfig>{
  webGLContextAttributes: {
    alpha: boolean,
    antialias: boolean,
    depth: boolean,
    failIfMajorPerformanceCaveat: boolean,
    powerPreference: "default" | "high-performance" | "low-power",
    premultipliedAlpha: boolean,
    preserveDrawingBuffer: boolean,
    stencil: boolean,
    desynchronized: boolean,
    xrCompatible: boolean,
  },
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
  webGLContextAttributes: {
    alpha: true,
    antialias: true,
    depth: true,
    failIfMajorPerformanceCaveat: true,
    powerPreference: "high-performance",
    premultipliedAlpha: true,
    preserveDrawingBuffer: true,
    stencil: true,
    desynchronized: true,
    xrCompatible: true,
  },
});

function App() {
  return <Unity unityContext={unityContext} />;
}
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

function App() {
  return <Unity unityContext={unityContext} />;
}
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

import React, { useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  useEffect(function () {
    unityContext.on("canvas", function (canvas) {
      canvas.getContext("webgl");
    });
  }, []);

  return <Unity unityContext={unityContext} />;
}
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

import React, { useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  useEffect(function () {
    unityContext.on("canvas", function (canvas) {
      canvas.width = 100;
      canvas.height = 50;
    });
  }, []);

  return (
    <Unity
      unityContext={unityContext}
      matchWebGLToCanvasSize={false}
      style={{ width: "100px", height: "100px" }}
    />
  );
}
```

## Taking Screenshots of the Canvas

> Available since version 8.6.0

Takes a screenshot of the canvas and returns a data URL containing image data. The image data is in .png format unless otherwise specified. Enabling preserve drawing buffer within the WebGL context attributes is required in order to take a screenshot.

```ts
function takeScreenshot(
  dataType?: "image/png" | "image/jpeg" | "image/webp",
  quality?: number
): string | null;
```

#### Example implementation

A basic implementation could look something like this. In the following example a button is added to the Render. When it's being clicked, a high quality JPEG screenshot will be taken and opened within a new tab.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
  webglContextAttributes: {
    preserveDrawingBuffer: true,
  },
});

function App() {
  function handleOnClickTakeScreenshot() {
    const data = unityContext.takeScreenshot("image/jpeg", 1.0);
    if (data !== null) {
      window.open(data, "_blank");
    }
  }

  return (
    <div>
      <button onClick={handleOnClickTakeScreenshot}>Take Screenshot</button>
      <Unity unityContext={unityContext} />
    </div>
  );
}
```

## Providing an external Memory File

> Available since version 8.8.0

This is set to the filename of the memory file when memory is stored in an external file, otherwise it is set to an empty string.

```tsx
<IUnityConfig>{
  memoryUrl: string,
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
  memoryUrl: "memoryfile",
});

function App() {
  return <Unity unityContext={unityContext} />;
}
```

## Providing Debugging Symbols

> Available since version 8.8.0

This is set to the filename of the JSON file containing debug symbols when the current build is using debug symbols, otherwise it is set to an empty string. If the Debug Symbols option is enabled and the Development Build option is disabled then the Debug Symbols will be generated automatically.

```tsx
<IUnityConfig>{
  symbolsUrl: string,
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
  symbolsUrl: "build/debug-symbols.json",
});

function App() {
  return <Unity unityContext={unityContext} />;
}
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
    window.UnityEvent("GameOver");
  },
  NextWave: function (waveNumberValue) {
    window.dispatchReactUnityEvent("NextWave", waveNumberValue);
  },
  ShowPopup: function (textStringPointer) {
    window.dispatchReactUnityEvent(
      "ShowPopup",
      Pointer_stringify(textStringPointer)
    );
  },
  SubmitScores: function (scoresFloatArrayPointer, arraySize) {
    var scores = [];
    for (var i = 0; i < arraySize; i++)
      scores.push(HEAPF32[(scoresFloatArrayPointer >> 2) + i]);
    window.dispatchReactUnityEvent("SubmitScores", scores);
  },
});
```

## Creating Unity WebGL builds

To get started with React Unity WebGL, you'll first need a Unity WebGL build. Nowadays with Unity 2020 and new, creating WebGL builds is easier then ever before. The following sections runs you though the basic steps of creating your very first WebGL build, and covers some frequently asked questions.

#### Setting the Target Build Platform

Start of by switching to the WebGL build platform, the target build platform can be changes from within the Build Settings window. This window can be found under the menu "File > Build Settings", or by pressing \[CMD+Shift+B\] on MacOS or \[CTRL+Shift+B\] on Windows respectively. When you've selected the WebGL build platform, proceed by clicking "Switch Platform". This process might take a while and will reimport your Assets.

#### Generated Files, Templates and Presentation Settings

When creating your WebGL build, Unity will by default generate a lot of files including HTML, CSS and a series of images. The reason these files are generated alongside your actual build is a selected Template from within your projects Player Settings. The same goes for the Height and Width settings. Unity allows for Templates to be added to your Asset directory and generate builds while bundeling them with these templates.

Since your React project is something entirely different, we're not going to need all these files, and we'll be focussing on the actual build instead. These files include the four files required by the Unity Context object. You can either use the Minimal template to reduse the number of unused file to be generated, or just ignore these files and only copy the files you'll need.

#### Builds Compression and Server Configuration

By default Unity compresses the generated files using the Brotli compression algorithm based on your Unity Version. Support for compressed files has nothing to do with this module but requires you to set up your server correctly. If you don't want to configure your server, you can disable compression from within the Player Setting's Publish section.

When chosing to use compressed builds, you might need to adjust your server configuration to match your specific build setup. In particular, there might be issues if you already have another server-side configuration to compress hosted files, which could interfere with this setup. To make the browser perform decompression natively while it downloads your application, append a Content-Encoding header to the server response. This header must correspond to the type of compression Unity uses at build time. For code samples, see Server Configuration Code Samples.

#### Runtime Debugging and Development Builds

When taking a look at the generated files, you'll find a lot of minified and mangled JavaScript. This might make debugging runtime issues quite challenging. Enable "Development Build" from the Player Settings window to prevent your build from becomming unreadable. This helps your debugging process, but these builds are not meant to be published since their buildsizes are hudge compaired to regular builds.

If you're having more questions about creating WebGL builds, feel free to take a look and open a new question on the [Discussion Board](https://github.com/jeffreylanters/react-unity-webgl/discussions).

<!-- ## Known Issues and Limitations

Active known issues and limitations will be documented here and will be linked to an issue or pull request. These issues include both Unity stand-alone as well as module problems. Once these issues are fixed on either side, they will be removed from the documentation.

- Builds made with Unity 2021.2 throws an error when removing the canvas before invoking Quit on the Unity Instance. Problem occurs within and outside of this module. An error is thrown when the canvas element is removed before invoking the Quit method on the Unity Instance. [#250](https://github.com/jeffreylanters/react-unity-webgl/issues/250)
- Some browsers will in combination with hot-module-reloading or server-side-rendering rescale the canvas's height indefinitely when no width or height is defined. To prevent this from happening provide these dimensions via either the style or className tag. The issues should not occur in production builds. [#233](https://github.com/jeffreylanters/react-unity-webgl/issues/233) -->

## Contribution and Development

When contributing to this repository, please first discuss the change you wish to make via the discussion board with me before making a change. Before commiting, please compile your code using npm run compile and open a pull request.

Before submitting a pull request, please make sure the following is done:

- Create a public fork [the React Unity WebGL repository](https://github.com/jeffreylanters/react-unity-webgl) and and commit your changes to a new branch from the main branch.
- Make sure the package installs using `npm install`, your code lints using `ts lint`, is formatted using [prettier](https://github.com/prettier/prettier) and compiles using `npm test`.
- Typecheck all of your changes and make sure the documentation in both the code, Read Me and JSDocs are provided.
- Make sure your changes passes and are compatibly with Unity WebGL builds using the [test environment](https://github.com/jeffreylanters/react-unity-webgl-tests) which provides a series of tests and basic implementations.

#### Development and Test-Cycle

> When building this package, do not use a symlink-based technique (e.g. with the "npm link" command) because [npm link breaks libraries that are based on React](https://dev.to/vcarl/testing-npm-packages-before-publishing-h7o).

> This package _must not_ have a dependency on React, only a dev dependency on @types/react. Otherwise, the users of this package might install two different versions of React which will lead to problems.

If you want to modify this package and iteratively test it in inside your application, use the following steps while you're inside the directory of your own application.

The "npm pack" command creates a .tgz file exactly the way it would if you were going to publish the package to npm. You can use that .tgz file to install it in your app. That way you can be sure that everything works exactly as it will do when you publish the package, later.

```sh
cd ../react-unity-webgl/
npm pack
cd ../your-app
npm remove react-unity-webgl
npm install ../react-unity-webgl/react-unity-webgl-x.y.z.tgz
```

#### Documentation Contribution

English is my second language and I suffer from dyslexia. I try to document everything as clearly and correctly as possible. Contributions to spelling and grammar errors are more than welcome and much appreciated.

Thanks for your contribution!
