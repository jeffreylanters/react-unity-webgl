# usage

To get stated import the Unity component from 'react-unity-webgl'. Once imported you can use the Unity component to load in your Unity content. Place the Unity tag along with a src to the json file Unity exported.

> Don't forget to add a script tag to load the `UnityLoader.js` file, exported by Unity in your base html file.

```js
import React, { Component } from "react";
import { Unity } from "react-unity-webgl";

export class App extends Component {
  render() {
    return (
      <div className="app">
        <Unity src="Build/myGame.json" />
      </div>
    );
  }
}
```
