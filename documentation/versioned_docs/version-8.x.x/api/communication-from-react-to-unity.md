# Communication from React to Unity

Sending messages from React to Unity is done using the Send method available via the Unity Context instance. The Send Method is similar to the SendMessage Method found internally in Unity.

The Method will invoke a public Method on an active GameObject in your Scene. Where gameObjectName is the name of an object in your scene; methodName is the name of a method in the script, currently attached to that object; value can be a string, a number, boolean or not defined at all.

```ts showLineNumber
function send(
  gameObjectName: string,
  methodName: string,
  parameter?: string | number | boolean
): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example a button is added to the Render. When it's being clicked, a method is invoked telling the Unity Context to send a message to a Game Object named "GameController" to invoke the method "SpawnEnemies" with an Int parameter.

```jsx showLineNumber
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

```csharp showLineNumber
// Attached to GameObject "GameController"
public class EnemyController : MonoBehaviour {
  public void SpawnEnemies (int amount) {
    Debug.Log ($"Spawning {amount} enemies!");
  }
}
```
