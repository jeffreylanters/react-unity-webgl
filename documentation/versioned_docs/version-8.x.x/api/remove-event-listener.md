# Removing an Event Listeners

Allows the deletion of specific event listeners for both built-in and custom events. This can come in handy when unmounting your component or changing your user interface. The event listener will be removed on both the React and Unity side.

```ts showLineNumbers
function removeEventListener(eventName: string): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll remove an event listener from the built-in on progress event, when the component will unmount.

```jsx showLineNumbers
import React, { useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  useEffect(function () {
    unityContext.on("progress", function (progression) {
      console.log(progression);
    });
    return function () {
      unityContext.removeEventListener("progress");
    };
  }, []);

  return <Unity unityContext={unityConext} />;
}
```
