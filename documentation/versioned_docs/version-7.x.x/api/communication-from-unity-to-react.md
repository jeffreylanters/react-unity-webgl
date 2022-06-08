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
