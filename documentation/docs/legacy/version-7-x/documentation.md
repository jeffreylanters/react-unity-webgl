# Version 7.x

:::caution
This legacy version of React Unity WebGL is only compatible with Unity 2018 and 2019!
:::

# Installation

Install using npm for your JavaScript (babel) and TypeScript React Project. Make sure you download the release matching with your Unity version. I try to update this plugin in case of need as fast as possible. For the corresponding, check the releases on [GitHub](https://github.com/elraccoone/react-unity-webgl/releases) or [NPM](https://www.npmjs.com/package/react-unity-webgl).

```sh
$ npm install react-unity-webgl@7
```

# Getting Started

```js
// Get started by creating a new React
// component and importing the libraries!

import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";

export class App extends React.Component {
  constructor(props) {
    super(props);

    // Next up create a new Unity Content object to
    // initialise and define your WebGL build. The
    // paths are relative from your index file.

    this.unityContent = new UnityContent(
      "MyGame/Build.json",
      "MyGame/UnityLoader.js"
    );
  }

  render() {
    // Finally render the Unity component and pass
    // the Unity content through the props.

    return <Unity unityContent={this.unityContent} />;
  }
}
```

# Communication from React to Unity

### JavaScript Example

```js
// Get started by creating a new React
// component and importing the libraries!

import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";

export class App extends React.Component {
  constructor(props) {
    super(props);

    // Next up create a new Unity Content object to
    // initialise and define your WebGL build. The
    // paths are relative from your index file.

    this.unityContent = new UnityContent(
      "MyGame/Build.json",
      "MyGame/UnityLoader.js"
    );
  }

  // create a new function for our button to send a
  // message and spawn enemies in our unity game.

  onClick() {
    // this function sends a message to a game object
    // named "SpawnController" to the public method
    // "SpawnEnemies" with a value of "10".

    this.unityContent.send("SpawnController", "SpawnEnemies", 10);
  }

  render() {
    // Finally render the Unity component and pass
    // the Unity content through the props. And create
    // a button to handle the click event.

    return (
      <div>
        <button onClick={this.onClick.bind(this)}>Spawn!</button>
        <Unity unityContent={this.unityContent} />
      </div>
    );
  }
}
```

# Communication from Unity to React

### JavaScript example

```js
// Get started by creating a new React
// component and importing the libraries!

import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";

export class App extends React.Component {
  constructor(props) {
    super(props);

    // Next up create a new Unity Content object to
    // initialise and define your WebGL build. The
    // paths are relative from your index file.

    this.unityContent = new UnityContent(
      "MyGame/Build.json",
      "MyGame/UnityLoader.js"
    );

    // Create a new listener for our Unity Events.
    // We're going to call this event "GameOver" and
    // pass the score to the listener. The second
    // parameter will be a function.

    this.unityContent.on("GameOver", (score) => {
      // Now we can use the score to for example
      // display it on our React app.

      this.setState({
        gameOver: true,
        score: score,
      });
    });
  }

  render() {
    // Finally render the Unity component and pass
    // the Unity content through the props.

    return <Unity unityContent={this.unityContent} />;
  }
}
```

## JSLib Example

In order to trigger the event we've just created, you have to create a JSLib file to bind the communication. The listener registered in React is now available in the ReactUnityWebGL object in any JSLib file. You can now create a JSLib file and get started. We're going to create a new JSLib file in the following directory. Assets/Plugins/WebGL/MyPlugin.jslib.

```js
mergeInto(LibraryManager.library, {
  // Create a new function with the same name as
  // the event listeners name and make sure the
  // parameters match as well.

  GameOver: function (score) {
    // Within the function we're going to trigger
    // the event within the ReactUnityWebGL object
    // which is exposed by the library to the window.

    ReactUnityWebGL.GameOver(score);
  },
});
```

## CSharp Example

Finally, to trigger to event within your CSharp code. We have to import the JSLib as following.

```js
using UnityEngine;
using System.Runtime.InteropServices;

public class GameController : MonoBehaviour {

  // Import the JSLib as following. Make sure the
  // names match with the JSLib file we've just created.

  [DllImport("__Internal")]
  private static extern void GameOver (int score);

  // Then create a function that is going to trigger
  // the imported function from our JSLib.

  public void GameOver (int score) {
    GameOver (score);
  }
}
```

# Communication Unity on Progress

On Progress is emitted while the Unity player is being loaded. The parameter contains the percentage from 0 to 1.

### JavaScript Example

```js
import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.unityContent = new UnityContent(
      "MyGame/Build.json",
      "MyGame/UnityLoader.js"
    );

    // Create a new listener for our progression Event.
    // While the Unity player is loading, it will
    // constantly keep telling us the progression.

    this.unityContent.on("progress", (progression) => {
      // Now we can use the progression to for example
      // display it on our React app.

      this.setState({
        progression: progression,
      });
    });
  }

  render() {
    // Finally render the Unity component and pass
    // the Unity content through the props. Along
    // with a loading progression text to inform
    // the user how fare the app is loaded.

    return (
      <div>
        <div>{`Loading ${this.state.progression * 100} percent...`}</div>
        <Unity unityContent={this.unityContent} />
      </div>
    );
  }
}
```

# Communication Unity on Loaded

On Progress is emitted when the Unity player is loaded.

### JavaScript Example

```js
import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.unityContent = new UnityContent(
      "MyGame/Build.json",
      "MyGame/UnityLoader.js"
    );

    // Create a new listener for our on loaded Event.
    // When the unity player is loaded, the event will
    // fire.

    this.unityContent.on("loaded", () => {
      // Now we can for example hide the loading overlay.

      this.setState({
        isLoading: false,
      });
    });
  }

  render() {
    // Finally render the Unity component and pass
    // the Unity content through the props. Along with
    // a text that shows wether the player is loading.

    return (
      <div>
        {this.state.isLoading === true && <div>{"Loading..."}</div>}
        <Unity unityContent={this.unityContent} />
      </div>
    );
  }
}
```

# Communication Unity on Quitted

On Quitted is emitted while the Unity player is quitted.

### JavaScript Example

```js
import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.unityContent = new UnityContent(
      "MyGame/Build.json",
      "MyGame/UnityLoader.js"
    );

    // Create a new listener for our on loaded Event.
    // When the unity player is quitted and unloaded,
    // the event will fire.

    this.unityContent.on("quitted", () => {
      // Now we can for example go back to another page
    });
  }

  render() {
    return (
      <div>
        <Unity unityContent={this.unityContent} />
      </div>
    );
  }
}
```

# Communication Unity on Error

since 7.1.5 On Progress is emitted while the Unity players actual project ran into an error. This is most likely a runtime error.

### JavaScript Example

```js
import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.unityContent = new UnityContent(
      "MyGame/Build.json",
      "MyGame/UnityLoader.js"
    );

    // Create a new listener for our error Event.
    // When the Unity player actual project ran
    // into an error, it will be thrown here.

    this.unityContent.on("error", (message) => {
      // Now we can use the error to for example
      // display it on our React app.

      this.setState({
        hasError: true,
        errorMessage: message,
      });
    });
  }

  render() {
    // Finally render the Unity component and pass
    // the Unity content through the props. Along
    // with a error display for when one occurred.

    return (
      <div>
        {this.state.hasError === true ? (
          <div>{this.state.errorMessage}</div>
        ) : (
          <Unity unityContent={this.unityContent} />
        )}
      </div>
    );
  }
}
```

# Communication Unity on Resize

On Resize is emitted when the Unity canvas has been scaled.

```js
import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.unityContent = new UnityContent({
      "MyGame/Build.json",
      "MyGame/UnityLoader.js"
    });

    // Create a new listener for our resize Event.

    this.unityContent.on("resize", () => {
      // The canvas has been resized, we can now
      // act on this behaviour.
    });
  }

  render() {
    // Finally render the Unity component and pass
    // the Unity content through the props. Along
    // with a loading progression text to inform
    // the user how fare the app is loaded.

    return <Unity unityContent={this.unityContent} />;
  }
}
```

# Unity Component

The Unity Component renders your Unity Player. The player can be configured with an Unity Content object. This allows you to create multiple Unity components all over your application and control them individually.

## Assigning the Unity Content

Once you've created your Unity Content you can pass it on the props of your Unity Component. See the object reference for further details. An implementation could look something like:

```jsx
<Unity unityContent={unityContent} />
```

## Other optional props

### Height and Weight

The default size is 800px width to 600px height. You can easily overrule them by passing the following props. The height and width properties are used to set the height and width of the wrapper element.

The height and width can be set to auto (Means that the browser calculates the height and width), or be specified in length values, like px, cm, etc., or in percent of the containing block. Note that the height and width properties do not include padding, borders, or margins; they set the height/width of the area inside the padding, border, and margin of the element!

```jsx
<Unity unityContent={unityContent} height="100%" width="950px" />
```

### ClassName

You can add an optional class name to the Unity component. The class name attribute specifies one or more class names for an HTML element. The class attribute is mostly used to point to a class in a style sheet. However, it can also be used by a JavaScript (via the HTML DOM) to make changes to HTML elements with a specified class.

```jsx
<Unity unityContent={unityContent} className="my-unity-app" />
```

# Unity Content

When rendering a Unity Component, you have to specify which Unity build to run within the Content. To do so you have to create an Unity Content object. Within the object you can specify various parameters to tell the component how to render, what to render and how to handle events.

## Creating the Content

Creating a Unity Content object is simple, just create a new unityContent model and pass your UnityConfig with it.

```js
let unityContent = new UnityContent({
    "MyGame/Build.json",
    "MyGame/UnityLoader.js"
});
```

## Adding event listeners

You can add event listeners to each Unity Content. These event listeners can be invoked by our Unity application's JSLib file located in your Plugins directory, or by any of the Build in events. Click here to learn more about event system. An implementation could look something like:

```js
unityContent.on("GameOver", (score) => {
  // Do something...
});
```

## Sending messages to your Unity Content

The Unity Content object allows you to send messages back to your Unity Instance. The first paramater contains the name of the Game Object you want to send your message to. The seconds parameter contains the name of the public method attached to the game object in any of its components.

These message can contain an optional value to take full control of the two-way communication. You can read more about parameters and JavaScript to Unityscript types here. An implementation could look something like:

```js
unityContent.send("SpawnController", "StartGame");
unityContent.send("SpawnController", "SpawnEnemies", 100);
```

## Setting Fullscreen

The Unity Content object allows you to enable and disable the fullscreen mode of your application. Cursor locking (using Cursor.lockState) and full-screen mode are both supported in WebGL, implemented using the respective HTML5 APIs (Element.requestPointerLock and Element.requestFullscreen). These are supported in Firefox and Chrome. Safari cannot currently use full-screen and cursor locking. An implementation could look something like:

```js
unityContent.setFullscreen(true);
unityContent.setFullscreen(false);
```

# Unity Config

When creating an Unity Content object, a third optional parameters is reserved for an Unity Config object. This object contains additional configuration for your content. An implementation could look something like:

```js
let unityContent = new UnityContent(
  "MyGame/Build.json",
  "MyGame/UnityLoader.js", {
    ...
  }
);
```

## Streaming Assets URL

Setting the url where the streaming assets can be found allows the loading of Streaming Assets from a specific URL. When using a relative url, keep in mind this is relative from the path where your html file is served. An implementation could look something like:

```js
let unityContent = new UnityContent(
  "MyGame/Build.json",
  "MyGame/UnityLoader.js",
  {
    streamingAssetsUrl: "MyGame/StreamingAssets",
  }
);
```

## Modules

The module object will overwrite the Unity modules. An implementation could look something like:

```js
let unityContent = new UnityContent(
  "MyGame/Build.json",
  "MyGame/UnityLoader.js", {
    modules: {
      ...
    }
  }
);
```

## Adjust On Window Resize

since 7.0.6 Since the Unity canvas itself does not respond to the resizing of it's container the Unity component will do this for you. The canvas will be adjusted to the size of the parent element when the window is resized. Adjusting on window resize is turned on by default.

```js
let unityContent = new UnityContent(
  "MyGame/Build.json",
  "MyGame/UnityLoader.js",
  {
    adjustOnWindowResize: true,
  }
);
```

## Unity Version

There is a possibility that future releases of Unity need specific WebGL support. So I've give the option to pass your Unity Version so if some special treatment is needed, I exactly know which patches I should apply to your Unity project.

See the UnityVersions.ts file to all the available options. An implementation could look something like:

```js
let unityContent = new UnityContent(
  "MyGame/Build.json",
  "MyGame/UnityLoader.js",
  {
    unityVersion: "2019.1.5",
  }
);
```

## ID

The ID is currently unused but could be used in future releases. An implementation could look something like:

```js
let unityContent = new UnityContent(
  "MyGame/Build.json",
  "MyGame/UnityLoader.js",
  {
    id: "MyGame",
  }
);
```

# JavaScript to UnityScript types

when sending messages to your Unity Player through a Unity Content object, there are various restrictions to the parameter types.

Simple numeric types can be passed to JavaScript in function parameters without requiring any conversion. Other data types will be passed as a pointer in the emscripten heap (which is really just a big array in JavaScript). For strings, you can use the Pointerstringify helper function to convert to a JavaScript string.

To return a string value you need to call \_malloc to allocate some memory and the writeStringToMemory helper function to write a JavaScript string to it. If the string is a return value, then the il2cpp runtime will take care of freeing the memory for you.

For arrays of primitive types, emscripten provides different ArrayBufferViews into it’s heap for different sizes of integer, unsigned integer or floating point representations of memory: HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64. To access a texture in WebGL, emscripten provides the GL.textures array which maps native texture IDs from Unity to WebGL texture objects. WebGL functions can be called on emscripten’s WebGL Context, GLctx.

# Contribution and Development

When contributing to this repository, please first discuss the change you wish to make via issue with the owners of this repository before making a change. Before commiting, please compile your code using npm run compile and open a pull request.

Before submitting a pull request, please make sure the following is done:

- Fork the repository and create your branch from master.
- Run npm install in the repository root.
- If you've fixed a bug or added code that should be tested, using the test environment.
- Ensure the test suite passes using npm test on the library.
- Ensure the test suite passes using npm start on the test environment and check if everything works.
- Format your code with prettier.
- Make sure your code lints (ts lint).
- Typecheck all of your changes and make sure JSDocs are provided.
- If you haven't already, complete the CLA.

## Development and test cycle

If you want to modify this package and iteratively test it in inside your application, use the following steps while you're inside the directory of your own application:

```sh
cd ../react-unity-webgl/
npm pack
cd ../yourapp
npm remove react-unity-webgl
npm install ../react-unity-webgl/react-unity-webgl-x.y.z.tgz
```

The "npm pack" command creates a .tgz file exactly the way it would if you were going to publish the package to npm. You can use that .tgz file to install it in your app. That way you can be sure that everything works exactly as it will do when you publish the package, later.

Do not use a symlink-based technique (e.g. with the "npm link" command) because npm link breaks libraries that are based on React.

This package here must not have a dependency on React, only a dev dependency on @types/react. Otherwise, the users of this package might install two different versions of React which will lead to problems.
