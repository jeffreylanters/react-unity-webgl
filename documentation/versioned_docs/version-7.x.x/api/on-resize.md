# On Unity Resize

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
