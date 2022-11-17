import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Communication from React to Unity

The send message function lets you asynchronously invoke a method in the Unity game.

## Type Definition

```tsx title="Type Definition"
function sendMessage(
  gameObjectName: string,
  methodName: string,
  parameter?: ReactUnityEventParameterType
): void;
```

```tsx title="Type Definition"
type ReactUnityEventParameter = string | number | undefined;
```

## Implementation

Sending messages from React to Unity is done using the send message function available via the Unity Context instance. The send message function is similar to the SendMessage Method found internally in Unity. The function will invoke a C-Sharp method of any protection level on an active GameObject in your Scene.

- Where `gameObjectName` is the name of an object in your scene
- `methodName` is the name of a C-Sharp method in the script, currently attached to that object
- `parameter` can be a string, a number, boolean or not defined at all

:::note
When invoking a C-Sharp method by sending a message, the name of the mono behaviour is not being used. We're only refering to the name of the GameObject within the Scene, thus the name of the mono behaviour is irrelevant.
:::

:::warning
Make sure the parameter matches the actual excistence and type of the C-Sharp method you're trying to invoke. Not doing so may cause unintended behaviour or even a crash of the Unity Application.
:::

:::info
Simple numeric types can be passed to JavaScript in function parameters without requiring any conversion. Other data types will be passed as a pointer in the emscripten heap (which is really just a big array in JavaScript). For strings, you can use the Pointerstringify helper function to convert to a JavaScript string. You can read more about [parameters and JavaScript to Unityscript types here](/docs/main-concepts/data-conversion).
:::

## Example Usage

A basic implementation could look something like this. In the following example a button is being rendered. When the button is clicked, a function will invoked telling the Unity Context to send a message to a GameObject named "GameController" to invoke the C-Sharp method named "SpawnEnemies" with an interger as the parameter.

<Tabs>
<TabItem value="App.jsx" label="App.jsx">

```jsx showLineNumbers title="App.jsx"
import React, { Fragment } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, sendMessage } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  function handleClickSpawnEnemies() {
    sendMessage("GameController", "SpawnEnemies", 100);
  }

  return (
    <Fragment>
      <Unity unityProvider={unityProvider} />
      <button onClick={handleClickSpawnEnemies}>Spawn Enemies</button>
    </Fragment>
  );
}
```

</TabItem>
<TabItem value="EnemyController.cs" label="EnemyController.cs">

:::info
Script is attached to GameObject with name "GameController".
:::

```cs showLineNumbers title="EnemyController.cs"
using UnityEngine;

public class EnemyController : MonoBehaviour {
  public void SpawnEnemies (int amount) {
    Debug.Log ($"Spawning {amount} enemies!");
  }
}
```

</TabItem>
</Tabs>
