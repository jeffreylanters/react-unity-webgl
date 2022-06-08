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
