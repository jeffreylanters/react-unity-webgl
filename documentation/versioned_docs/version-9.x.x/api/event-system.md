import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Communication from Unity to React

The event system allows you to receive messages sent from the Unity game.

## Type Definition

```tsx title="Type Definition"
function addEventListener(
  eventName: string,
  callback: (...parameters: ReactUnityEventParameterType[]) => void
): void;
```

```tsx title="Type Definition"
function removeEventListener(
  eventName: string,
  callback: (...parameters: ReactUnityEventParameterType[]) => void
): void;
```

```tsx title="Type Definition"
function dispatchReactUnityEvent(
  eventName: string,
  ...parameters: ReactUnityEventParameterType[]
): void;
```

```tsx title="Type Definition"
type ReactUnityEventParameter = string | number | undefined;
```

## Implementation

Sending messages from Unity to React is done by registering an event listener to the Unity Context instance. Event listeners are distinguished by the name of the event. The event listener takes a callback function as its second parameter. The callback function will be invoked when the event is fired, the passed parameters will be passed to the callback function.

:::info
Keep in mind communication from Unity to React is handeld globally, this means event listeners with the same name will be invoked on all Unity Context instances.
:::

:::info
Simple numeric types can be passed to JavaScript in function parameters without requiring any conversion. Other data types will be passed as a pointer in the emscripten heap (which is really just a big array in JavaScript). For strings, you can use the Pointerstringify helper function to convert to a JavaScript string. You can read more about [parameters and JavaScript to Unityscript types here](/docs/main-concepts/data-conversion).
:::

Sending messages from Unity to React consists of two parts, registering an event listener and dispatching an event.

### Registering event listeners

An event listeners can be registered to and remove from the Unity Context instance. Start by registering the event listener using the `addEventListener` function as following. To remove an event listener, use the `removeEventListener` function.

- Where `eventName` is the name of your listener
- The `eventListener` reference will be the function which will be invoked. It may or may not pass along any arguments based on your implementation

To get started, destructure the add and remove event lister functions from the Unity Context.

```jsx showLineNumbers title="Example: Destructuring the required functions"
const { addEventListener, removeEventListener } = useUnityContext();
```

Next you'll be able to register and remove the event listeners to and from the Unity Context.

#### Binding the callback to a state

When your event listener's callback method's parameters match the parameters of a state, you can bind the callback to the state. This will allow you to update the state when the event is fired.

```jsx showLineNumbers title="Example: Binding the callback to a state"
const [score, setScore] = useState();

useEffect(() => {
  addEventListener("SetScore", setScore);
  return () => {
    removeEventListener("SetScore", setScore);
  };
}, [addEventListener, removeEventListener, setScore]);
```

#### Binding the callback to a function

When your event listener's callback method's parameters don't match the parameters of a state, you can bind the callback to a function. This will allow you to act when the event is fired.

```jsx showLineNumbers title="Example: Binding the callback to a function"
const handleSetScore = useCallback((score) => {
  // Do something with the score
}, []);

useEffect(() => {
  addEventListener("SetScore", handleSetScore);
  return () => {
    removeEventListener("SetScore", handleSetScore);
  };
}, [addEventListener, removeEventListener, handleSetScore]);
```

:::info
While using a function component, always bind your callback using some sort of effect hook, so that the callback is removed when the component is unmounted or will re-render.
:::

### Dispatching events

To dispatch events, the module exposes a global function; `dispatchReactUnityEvent`. This function takes the event name and parameters as arguments and will dispatch the event to the corresponding Unity Context.

To dispatch an event, a JSLib file has to be created within your Unity project's `/Plugins/WebGL` directory. JSLibs are used to invoke javascript functions from within your Unity Application. The React Unity WebGL module exposes a global function to the window which allows for the dispatchment of the Event Listeners. When creating your JSLib, simply invoke the eventName using the global function `dispatchReactUnityEvent` with an optional parameter.

```js showLineNumbers title="Example: Dispatching an event from a JSLib"
mergeInto(LibraryManager.library, {
  SetScore: function (score) {
    try {
      window.dispatchReactUnityEvent("SetScore", score);
    } catch (e) {
      console.warn("Failed to dispatch event");
    }
  },
});
```

:::tip
When directly referring to a dispatch function in your JSLib, it is recommended to match the name of the JSLib's function to the name of the event.
:::

:::tip
Wrap the dispatch event function in a try catch block to prevent errors from being thrown running outside of the React Unity WebGL module.
:::

Unity makes the JSLib's functions available to the Unity application by merging them into the `LibraryManager.library` object. This allows you to invoke the JSLib's functions from within your Unity application by importing them using Unity's DLL Importer. To link the internal method to the JSLib's function, make sure to match both the name of the function as well as its signature.

```cs showLineNumbers title="Example: Dispatching an JSLib function from CSharp"
public class GameController : MonoBehaviour {
  [DllImport("__Internal")]
  private static extern void SetScore (int score);

  public void GameOver () {
#if UNITY_WEBGL == true && UNITY_EDITOR == false
    SetScore (259);
#endif
  }
}
```

:::tip
WebGL methods in general are not available in the Unity Editor. Prevent invoking these methods when the Application is not running the WebGL environment, e.g The Unity Editor.
:::

## Example Usage

A basic implementation could look something like this. In the following example we'll register an event listener to listen to an event named "GameOver" with two parameters; the score and the name of the player. The event listener will update the state of the score and display the name of the player.

<Tabs>
<TabItem value="App.jsx" label="App.jsx">

```jsx showLineNumbers title="App.jsx"
import React, { Fragment, useState, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [userName, setUserName] = useState();
  const [score, setScore] = useState();

  const { unityProvider, addEventListener, removeEventListener } =
    useUnityContext({
      loaderUrl: "build/myunityapp.loader.js",
      dataUrl: "build/myunityapp.data",
      frameworkUrl: "build/myunityapp.framework.js",
      codeUrl: "build/myunityapp.wasm",
    });

  const handleGameOver = useCallback((userName, score) => {
    setIsGameOver(true);
    setUserName(userName);
    setScore(score);
  }, []);

  useEffect(() => {
    addEventListener("GameOver", handleGameOver);
    return () => {
      removeEventListener("GameOver", handleGameOver);
    };
  }, [addEventListener, removeEventListener, handleGameOver]);

  return (
    <Fragment>
      <Unity unityProvider={unityProvider} />
      {isGameOver === true && (
        <p>{`Game Over ${userName}! You've scored ${score} points.`}</p>
      )}
    </Fragment>
  );
}
```

</TabItem>
<TabItem value="GameController.cs" label="GameController.cs">

```cs showLineNumbers title="GameController.cs"
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

</TabItem>
<TabItem value="React.jslib" label="React.jslib">

:::info
The name of this file is irrelevant, but it must be placed in the `/Plugins/WebGL` directory of your Unity project.
:::

```js showLineNumbers title="React.jslib"
mergeInto(LibraryManager.library, {
  GameOver: function (userName, score) {
    window.dispatchReactUnityEvent("GameOver", UTF8ToString(userName), score);
  },
});
```

</TabItem>
</Tabs>
