# Catching Errors

since 7.1.5 On Progress is emitted while the Unity players actual project ran into an error. This is most likely a runtime error.

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

    // Create a new listener for our error Event.
    // When the Unity player actual project ran
    // into an error, it will be thrown here.

    this.unityContent.on("error", (message) => {
      // Now we can use the error to for example
      // display it on our React app.

      this.setState({
        hasError: true,
        errorMessage: message,
      });
    });
  }

  render() {
    // Finally render the Unity component and pass
    // the Unity content through the props. Along
    // with a error display for when one occurred.

    return (
      <div>
        {this.state.hasError === true ? (
          <div>{this.state.errorMessage}</div>
        ) : (
          <Unity unityContent={this.unityContent} />
        )}
      </div>
    );
  }
}
```
