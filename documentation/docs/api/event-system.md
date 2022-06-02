import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Communication from Unity to React

The event system allows you to receive messages sent from the Unity game.

> Available since version 9.0.0

## Type Definition

```tsx title="Type Definition"
function addEventListener: (
  eventName: string,
  callback: (...parameters: ReactUnityEventParameterType[]) => void
) => void;
```

```tsx title="Type Definition"
function removeEventListener: (
  eventName: string,
  callback: (...parameters: ReactUnityEventParameterType[]) => void
) => void;
```

```tsx title="Type Definition"
function dispatchReactUnityEvent = (
  eventName: string,
  ...parameters: ReactUnityEventParameterType[]
): void
```

## Implementation

Sending messages from Unity to React is done by registering an event listener to the Unity Context instance. Event listeners are distinguished by the name of the event. The event listener takes a callback function as its second parameter. The callback function will be invoked when the event is fired, the passed parameters will be passed to the callback function.

:::info
Keep in mind communication from Unity to React is handeld globally, this means event listeners with the same name will be invoked on all Unity Context instances.
:::

:::info
Simple numeric types can be passed to JavaScript in function parameters without requiring any conversion. Other data types will be passed as a pointer in the emscripten heap (which is really just a big array in JavaScript). For strings, you can use the Pointerstringify helper function to convert to a JavaScript string. You can read more about [parameters and JavaScript to Unityscript types here](http://localhost:3000/docs/main-concepts/javascript-to-unityscript-types).
:::

<!-- TODO finish -->
