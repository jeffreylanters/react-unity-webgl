# Communication from Unity to React

Sending messages from Unity to React is done using Event Listeners via the Unity Context instance. Invoking these Event Listeners from your Unity Project is quite different.

On the React side of your project an Event Listeners can be registered to the Unity Context instance. Register the Event Listener using the "on" method as following, where "eventName" is the name of your listener, and the "eventListener" method is the Method which will be Invoked which may or may not pass along any Arguments based on your implementation.

:::info
Keep in mind communication from Unity to React is global, so Event Listeners with the same name will will be invoked on all Unity Instances.
:::

:::info
Simple numeric types can be passed to JavaScript in function parameters without requiring any conversion. Other data types will be passed as a pointer in the emscripten heap (which is really just a big array in JavaScript). For strings, you can use the Pointerstringify helper function to convert to a JavaScript string. You can read more about parameters and [JavaScript to Unityscript types](#javascript-to-unityscript-types) here.
:::

```ts showLineNumber
function on(eventName: string, eventListener: Function): void;
```

In order to dispatch Event Listeners, a JSLib file has to be created within your Unity Project "Plugins/WebGL" directory. The React Unity WebGL module exposes a global method to the window which allows for the dispatchment of the Event Listeners. When writing your JSLib file, simply invoke the eventName using the global methpd "dispatchReactUnityEvent" with an optional parameter.

```ts showLineNumber
function dispatchReactUnityEvent(eventName: string, ...parameters: any);
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll create a new Event Listener with the event name "GameOver" which passes along a userName and an interger container the score. When the Event is emitted we'll change the State.

```jsx showLineNumber
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

We'll start of by creating a new method inside of our JSLib. The name of this method can be anything, but in this example we'll give it it the same name as our Event Name to keep things clean. In the body of the method, we'll emit our Event Listener by invoking the global method "dispatchReactUnityEvent" exposed by this module. All of your Event Listeners are available using the Event Name as the first parameter. We'll pass along the userName and the score. The userName has to go through the built-in `UTF8ToString` method (or the `Pointer_stringify` method when using Unity 2021.1 or older) in order to get the value, otherwise a int pointer will be passed instead. You can read more about parameters and [JavaScript to Unityscript types](#javascript-to-unityscript-types) here.

```js showLineNumber
// File: MyPlugin.jslib
mergeInto(LibraryManager.library, {
  GameOver: function (userName, score) {
    window.dispatchReactUnityEvent("GameOver", UTF8ToString(userName), score);
  },
});
```

Finally, to emit to Event Listener within your CSharp code. We're importing the JSLib using Unity's DllImporter as following. When the name of imported Method matches with the Method's name in the JSLib, you can invoke it.

:::info
WebGL methods in general are not available in the Unity Editor. Prevent invoking these methods when the Application is not running the WebGL environment, e.g The Unity Editor.
:::

```csharp showLineNumber
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
