<div align="center">

<img src="https://raw.githubusercontent.com/elraccoone/react-unity-webgl/master/.github/WIKI/logo.png" height="100px">

# React Unity WebGL

[![license](https://img.shields.io/badge/license-Apache_2.0-red.svg?style=for-the-badge)]()
[![npm](https://img.shields.io/npm/v/react-unity-webgl.svg?style=for-the-badge)]()
[![npm](https://img.shields.io/badge/build-passing-brightgreen.svg?style=for-the-badge)]()
<br/>
[![npm](https://img.shields.io/github/stars/elraccoone/react-unity-webgl.svg?style=for-the-badge)]()
[![npm](https://img.shields.io/npm/dt/react-unity-webgl.svg?style=for-the-badge)]()

When building content for the web, you might need to communicate with elements on a webpage. Or you might want to implement functionality using Web APIs which Unity does not currently expose by default. In both cases, you need to directly interface with the browser’s JavaScript engine. React Unity WebGL provides an easy solution for embedding Unity WebGL builds in your React application, with two-way communication between your React and Unity application with advanced API's.

**&Lt;**
[**Documentation**](https://github.com/elraccoone/react-unity-webgl#readme) &middot;
[**Test Environment**](https://github.com/jeffreylanters/react-unity-webgl-test) &middot;
[**Buy me a Coffee**](https://paypal.me/jeffreylanters)
**&Gt;**

<br/><br/>

[![npm](https://img.shields.io/badge/sponsor_the_project-donate-E12C9A.svg?style=for-the-badge)](https://paypal.me/jeffreylanters)

Hi! My name is Jeffrey Lanters, thanks for visiting! This package is an open source hobby project with ongoing development. A result of a long road and endless fight with Unity's updates since 2017, full of sleepless nights, working after hours, and busy weekends. If you're using this module for production, please consider donating to support the project. Thank you!

**&Lt;**
**Made with &hearts; by Jeffrey Lanters**
**&Gt;**

<br/><br/>

</div>

# Installation

Install using npm for your JavaScript or TypeScript React Project. Make sure you download the package version corresponding with your Unity version. I try to update this plugin in case of need as fast as possible. Please keep in mind that some documentation may not be accurate when using an older version of this module.

```sh
$ npm install react-unity-webgl@8.x  # For Unity 2020 and 2021
$ npm install react-unity-webgl@7.x  # For Unity 2018 and 2019 (LTS)
$ npm install react-unity-webgl@6.x  # For Unity 2017 (LTS)
$ npm install react-unity-webgl@5.x  # For Unity 5.6 (LTS)
```

# Documentation

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

Sending messages from Unity to React is done using Event Listeners via the Unity Context instance. Invoking these Event Listeners from your Unity Project is quite different.

On the React side of your project an Event Listeners can be registered to the Unity Context instance. Register the Event Listener using the "on" method as following, where "eventName" is the name of your listener, and the "eventListener" method is the Method which will be Invoked which may or may not pass along any Arguments based on your implementation.

> Keep in mind communication from Unity to React is global, so Event Listeners with the same name will overwrite one another.

```ts
function on(eventName: string, eventListener: Function): any;
```

In order to invoke Event Listeners, a JSLib file has to be created within your Unity Project "Plugins/WebGL" directory. The React Unity WebGL module exposes a global Object which allows for the invoking of the Event Listeners. When writing your JSLib file, simply invoke the eventName as a member of the "ReactUnityWebGL" object within any method.

```js
ReactUnityWebGL[eventName: string];
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll create a new Event Listener with the event name "GameOver" which passes along an interger container the score. When the Event is invoked we'll change the State.

```jsx
// File: App.jsx

import React, { Component } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGameOver: false,
      score: 0,
    };

    this.unityContext = new UnityContext({
      loaderUrl: "build/myunityapp.loader.js",
      dataUrl: "build/myunityapp.data",
      frameworkUrl: "build/myunityapp.framework.js",
      codeUrl: "build/myunityapp.wasm",
    });

    this.unityContext.on("GameOver", (score) => {
      this.setState({
        isGameOver: true,
        score: score,
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.isGameOver == true && (
          <p>Game over! Your score: {this.state.score}</p>
        )}
        <Unity unityContext={this.unityContext} />
      </div>
    );
  }
}
```

To invoke the Event Listener we've just created, we'll have to create a new JSLib file within our Unity Project first. This JSLib file will be places within the "Assets/Plugins/WebGL" directory. The JSLib itself has nothing to do with this module, it is natively supported by Unity.

We'll start of by creating a new method inside of our JSLib. The name of this method can be anything, but in this example we'll give it it the same name as our Event Name to keep things clean. In the body of the method, we'll invoke our Event Listener by calling a method on the "ReactUnityWebGL" object exposed by the module. All of your Event Listeners are available as a property using the Event Name on the object. We'll pass along the score.

```js
// File: MyPlugin.jslib

mergeInto(LibraryManager.library, {
  GameOver: function (score) {
    ReactUnityWebGL.GameOver(score);
  },
});
```

Finally, to trigger to Event Listener within your CSharp code. We're importing the JSLib using Unity's DllImporter as following. When the name of imported Method matches with the Method's name in the JSLib, you can invoke it.

> Prevent invoking the method when the Application is not running the WebGL environment, e.g The Unity Editor.

```csharp
/// File: GameController.cs

using UnityEngine;
using System.Runtime.InteropServices;

public class GameController : MonoBehaviour {

  [DllImport("__Internal")]
  private static extern void GameOver (int score);

  public void SomeMethod () {
    GameOver (100);
  }
}
```

## Tracking the loading progression

While your game is being downloaded from the server and loaded into memory, you might want to display some sort of loading indicator informing the user of the progression. The built-in progression event listeners can be used for such cases. On Progress is emitted while the Unity player is being loaded. The parameter contains the progression from 0 to 1. When the game is fully loaded into memory and will start execution, the progression will hit 1. The event will invoke everytime the progression advances.

```ts
function on(
  eventName: "progress",
  eventListener: (progression: number) => void
): any;
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
        <p>Loading... {this.state.progression * 100}%</p>
        <Unity unityContext={this.unityContext} />
      </div>
    );
  }
}
```

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

# OLD OLD OLD OLD OLD OLD OLD

#### On Loaded event

On Loaded is emitted when the Unity player is loaded into memory and execution is started. Event will be invoked only once.

```ts
function on(eventName: "loaded", eventListener: () => void): any;
```

#### On Quitted event

On Progress is emitted while the Unity player is quitted. Event will be invoked when Application.Quit is invoked from within the Unity process or when the Unity Component will Unmount.

> This event listener is supported since Unity 2020.1

```ts
function on(eventName: "quitted", eventListener: () => void): any;
```

#### On Error event

On Error is emitted while the Unity Player runs into an error. This is most likely a runtime error. The error details and stack trace are passed along via the parameter.

> Keep in mind that Unity WebGL production builds contain obfuscation code which might be hard to debug.

```ts
function on(eventName: "error", eventListener: (message: string) => void): any;
```
