# On Unity Quitted

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
