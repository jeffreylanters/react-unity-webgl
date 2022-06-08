# Tracking Progression

On Progress is emitted while the Unity player is being loaded. The parameter contains the percentage from 0 to 1.

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

    // Create a new listener for our progression Event.
    // While the Unity player is loading, it will
    // constantly keep telling us the progression.

    this.unityContent.on("progress", (progression) => {
      // Now we can use the progression to for example
      // display it on our React app.

      this.setState({
        progression: progression,
      });
    });
  }

  render() {
    // Finally render the Unity component and pass
    // the Unity content through the props. Along
    // with a loading progression text to inform
    // the user how fare the app is loaded.

    return (
      <div>
        <div>{`Loading ${this.state.progression * 100} percent...`}</div>
        <Unity unityContent={this.unityContent} />
      </div>
    );
  }
}
```
