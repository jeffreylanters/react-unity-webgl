# Unity to React Communication

We also allow you to call JavaScript functions within React from the Unity Content. To get started import the function RegisterExternalListener from react-unity-webgl.

```js
RegisterExternalListener (methodName: String, callback: Function): void;
```

Where methodName is the name of a method in your JSLib, this method will be binded to the current browser ReactUnityWebGL object so you can refer to it in your JSLib; callback will be a function, which takes one parameter with the value passed by your content. Note that it is recommended to register the callbacks before loading the Unity content. For example:

```js
import React from "react";
import { RegisterExternalListener } from "react-unity-webgl";

export class App extends React.Component {
  constructor() {
    RegisterExternalListener("OpenMenu", this.openMenu.bind(this));
  }
  openMenu(menuId) {
    this.setState({
      menuId: menuId,
    });
  }
}
```

In order to use the function, you have to create a JSLib file to bind the communication. The listener registered in React is now available in the ReactUnityWebGL object in any JSLib file. You can now create a JSLib file and get started. `Assets/Plugins/WebGL/MyPlugin.jslib`.

```js
mergeInto(LibraryManager.library, {
  OpenMenu: function (menuId) {
    ReactUnityWebGL.OpenMenu(menuId);
  },
});
```

Now you can make the OpenMenu function your just made in the JSLib available in any C-Sharp script by exposing it as following.

```cs
using UnityEngine;

public class MenuController: MonoBehaviour {
  [DllImport("__Internal")]
  private static extern void OpenMenu (string menuId);

  public void OpenReactMenuById (string menuId) {
    OpenMenu (menuId);
  }
}
```
