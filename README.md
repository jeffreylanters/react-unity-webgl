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

It's really quick and easy to get your first React Unity project up-and-running. Just make sure you have your Unity WebGL build ready, and have your React project set up. There are not specific React requirements, any project will do. If it's the first time working with React, I recommend checking out [Create React App](https://reactjs.org/docs/create-a-new-react-app.html). Both JavaScript and TypeScript are compatible.

Get started by import the Unity and Unity Context classes from the React Unity WebGL module. The Unity Context model will house all of your configuration, event listeners and references. Create a new Context Object, pass along the paths to your Unity build and assign it to the Unity componentin your Render Method.

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

Happy Coding!

## Communication between React and Unity

The Unity Context model consists of a set of methods and event listeners allow for you to have full control of your Unity Application using the messaging system.

### Communication from React to Unity

Sending messages from React to Unity is done using the Send method available via the Unity Context instance. The Send Method is simalar to the SendMessage Method found internally in Unity.

The Method will invoke a public Method on an active GameObject in your Scene. Where gameObjectName is the name of an object in your scene; methodName is the name of a method in the script, currently attached to that object; value can be a string, a number, boolean or not defined at all.

```ts
function send(
  gameObjectName: string,
  methodName: string,
  parameter?: string | number | boolean
): void;
```

```jsx
// Example code: App.jsx

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
      <button onClick={() => spawnEnemies(100)} />
      <Unity unityContext={unityContext} />
    </div>
  );
};
```

### Communication from Unity to React

Communicating to other way around is quite different. Sending messages is done via JSLib files which will interface directly the React Unity WebGL module which will invoke event listeners.

On the React side of your project event listeners can be bound to the Unity Context instance. Register the event listener as following, where eventName is the name of your listener, and the eventListener method is the method which will be invoked which may or may not pass along any arguments based on your implementation.

> Keep in mind communication from Unity to React is global, so event listeners with the same name will overwrite one another.

```ts
function on(eventName: string, eventListener: Function): any;
```

```jsx
// Example code: App.jsx

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
    return <Unity unityContext={this.unityContext} />;
  }
}
```

In order to trigger the event we've just created, you have to create a JSLib file to bind the communication. The listener registered in React is now available in the ReactUnityWebGL object in any JSLib file by the name you've registered it on the Unity Context instance. You can now create a JSLib file and get started. We're going to create a new JSLib file in the following directory. `Assets/Plugins/WebGL/MyPlugin.jslib`.

```js
// Example code: MyPlugin.jslib

mergeInto(LibraryManager.library, {
  GameOver: function (score) {
    ReactUnityWebGL.GameOver(score);
  },
});
```

Finally, to trigger to event within your CSharp code. Import the JSLib using Unity's DllImporter as following. When the name of imported Method matches with the name in the JSLib, you can invoke it.

> Prevent invoking the method when the Application is not running the WebGL environment, e.g The Unity Editor.

```csharp
/// Example code: GameController.cs

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
