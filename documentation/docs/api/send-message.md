import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Communication from React to Unity

The send message function lets you asynchronously invoke a method in the Unity game.

> Available since version 9.0.0

## Type Definition

```tsx title="Type Definition"
function sendMessage(
  gameObjectName: string,
  methodName: string,
  parameter?: ReactUnityEventParameterType
): void;
```

## Implementation

Sending messages from React to Unity is done using the send message function available via the Unity Context instance. The send message function is similar to the SendMessage Method found internally in Unity. The function will invoke a method of any protection level on an active GameObject in your Scene.

- Where `gameObjectName` is the name of an object in your scene
- `methodName` is the name of a method in the script, currently attached to that object
- `parameter` can be a string, a number, boolean or not defined at all

:::info
When invoking a method by sending a message, the name of the mono behaviour is not used. We're only refering to the name of the GameObject within the Scene.
:::

## Example Usage

A basic implementation could look something like this. In the following example a button is being rendered. When the button is clicked, a function will invoked telling the Unity Context to send a message to a GameObject named "GameController" to invoke the method named "SpawnEnemies" with an interger as the parameter.

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
      <Unity unityProvider={unityProvider} tabIndex={1} />
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
