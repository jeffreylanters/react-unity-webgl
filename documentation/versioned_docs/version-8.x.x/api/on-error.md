# Catching Runtime and Loading Errors

:::warning
Keep in mind that Unity WebGL production builds contain obfuscation code which might be hard to debug.
:::

:::info
By default Unity Alerts all errors thrown by the Unity Player. This can become very annoying, especially for an experienced web developer. Even though the module catches all of these errors, there is sadly no way to disable the Alert behaviour from outside of your Unity Build. There are two things you can do to disable the alerts, either find and replace the alert in your generated Unity Loader, or overwrite your windows alert method. I'm trying to contact Unity about this, and when a solution is available, I'll be the first to happily implement this.
:::

When your Applications run into a runtime error, you might want to display your players any kind of error screen, or debug the problem yourself. The built-in error event listeners can be used for such cases. On Error is emitted while the Unity Player runs into an error. This is most likely a runtime error. The error details and stack trace are passed along via the parameter.

When something goes wrong during the mounting of your application, this can be caused by various reasons such as an invalid Unity Loader or undefined variable, an error event will be dispatched as well.

```ts
function on(eventName: "error", eventListener: (message: string) => void): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll display the application until an error occurs, then we'll unmount the application and show the error message instead.

```jsx showLineNumbers
import React, { useState, useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  const [didError, setDidError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(function () {
    unityContext.on("error", function (message) {
      setDidError(true);
      setErrorMessage(message);
    });
  }, []);

  return didError === true ? (
    <div>Oops, that's an error {errorMessage}</div>
  ) : (
    <Unity unityContext={unityConext} />
  );
}
```
