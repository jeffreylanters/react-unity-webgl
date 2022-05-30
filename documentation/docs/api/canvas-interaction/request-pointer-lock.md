# Request Pointer Lock

The request pointer lock function lets you asynchronously ask for the pointer to be locked on the Unity Application's canvas.

> Available since version 9.0.0

## Type Definition

```tsx title="Type Definition"
function requestPointerLock(): void;
```

## Implementation

The Pointer Lock API provides input methods based on the movement of the mouse over time (i.e., deltas), not just the absolute position of the mouse cursor in the viewport. It gives you access to raw mouse movement, locks the target of mouse events to a single element, eliminates limits on how far mouse movement can go in a single direction, and removes the cursor from view. It is ideal for first person 3D games, for example.

More than that, the API is useful for any applications that require significant mouse input to control movements, rotate objects, and change entries, for example allowing users to control the viewing angle by moving the mouse around without any button clicking. The buttons are then freed up for other actions. Other examples include apps for viewing maps or satellite imagery.

Pointer lock lets you access mouse events even when the cursor goes past the boundary of the browser or screen. For example, your users can continue to rotate or manipulate a 3D model by moving the mouse without end. Without Pointer lock, the rotation or manipulation stops the moment the pointer reaches the edge of the browser or screen. Game players can now click buttons and swipe the mouse cursor back and forth without worrying about leaving the game play area and accidentally clicking another application that would take mouse focus away from the game.

:::info
It is posible to also request entering fullscreen within the canvas via the [request fullscreen function](/docs/api/canvas-interaction/request-fullscreen) within the Unity Context. Cursor locking and full-screen mode are both supported simultaneously in React Unity WebGL, implemented using their respective HTML5 APIs.
:::

To get started, destructure the request pointer lock function from the Unity Context.

```jsx showLineNumbers title="Example: Destructuring the request pointer lock function"
const { requestPointerLock } = useUnityContext();
```

Next you'll be able to invoke the request pointer lock function with the desired state.

```jsx showLineNumbers title="Example: Using the set fullscreen function"
function handleClick() {
  requestPointerLock();
}

return <div onClick={handleClick}>Lock Pointer</div>;
```

## Example Usage

A basic implementation could look something like this. In the following example we'll add an event listener to the document where if the user clicks anywhere on the screen, the pointer lock will be requested.

```jsx showLineNumbers title="App.jsx"
import React, { useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, requestPointerLock } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  useEffect(
    function () {
      document.addEventListener("click", requestPointerLock);
      return function () {
        document.removeEventListener("click", requestPointerLock);
      };
    },
    [requestPointerLock]
  );

  return <Unity unityProvider={unityProvider} />;
}
```
