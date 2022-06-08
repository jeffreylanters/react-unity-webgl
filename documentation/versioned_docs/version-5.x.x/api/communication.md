# Communication

Unity allows you to send Javascript messages to the Unity content. In order to do so using React you have to import the Message function from 'react-unity-webgl'. The first parameter is the target game object name, the next is the method name, and the last is a optional parameter value.

```js
import React, { Component } from "react";
import { Message } from "react-unity-webgl";

export class Menu extends Component {
  onClick() {
    Message("myGameObjectName", "myMethodName", "paramterValue");
  }
  render() {
    return (
      <div className="menu">
        <div onClick={this.onClick.bind(this)}>Click me</div>
      </div>
    );
  }
}
```
