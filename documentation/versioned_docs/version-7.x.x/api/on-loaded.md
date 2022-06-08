# Awaiting On Load

On Progress is emitted when the Unity player is loaded.

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
    // When the unity player is loaded, the event will
    // fire.

    this.unityContent.on("loaded", () => {
      // Now we can for example hide the loading overlay.

      this.setState({
        isLoading: false,
      });
    });
  }

  render() {
    // Finally render the Unity component and pass
    // the Unity content through the props. Along with
    // a text that shows wether the player is loading.

    return (
      <div>
        {this.state.isLoading === true && <div>{"Loading..."}</div>}
        <Unity unityContent={this.unityContent} />
      </div>
    );
  }
}
```
