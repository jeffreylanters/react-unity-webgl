# React to Unity Communication

Sometimes you need to send some data or notification to the Unity script from the browser’s JavaScript. The recommended way of doing it is to call methods on GameObjects in your content. To get started import the class UnityEvent from react-unity-webgl.

```js
UnityEvent(objectName: String, methodName: String);
```

Where objectName is the name of an object in your scene; methodName is the name of a method in the script, currently attached to that object. When you've created a new UnityEvent, you can call the 'emit' function to fire it into Unity. You can pass an optional parameter value.

```js
import React from "react";
import { UnityEvent } from "react-unity-webgl";

export class App extends React.Component {
  constructor() {
    this.spawnEnemies = new UnityEvent("SpawnBehaviour", "SpawnEnemies");
  }
  onClickSpawnEnemies(count) {
    if (this.spawnEnemies.canEmit() === true) this.spawnEnemies.emit(count);
  }
  render() {
    return (
      <div onClick={this.onClickSpawnEnemies.bind(this, 5)}>
        Click to Spawn 5 Enemies
      </div>
    );
  }
}
```

While in Unity the following script is attached the a game object named 'SpawnBehaviour'.

```cs
using UnityEngine;

public class SpawnController: MonoBehaviour {
  public void SpawnEnemies (int count) {
    Debug.Log (string.Format ("Spawning {0} enemies", count));
  }
}
```
