<div align="center">

<img src="https://raw.githubusercontent.com/elraccoone/react-unity-webgl/master/.github/WIKI/logo.png" height="300px"></br>

[![license](https://img.shields.io/badge/license-Apache_2.0-red.svg?style=for-the-badge)]()
[![npm](https://img.shields.io/npm/v/react-unity-webgl.svg?style=for-the-badge)]()
[![npm](https://img.shields.io/badge/build-passing-brightgreen.svg?style=for-the-badge)]()
<br/>
[![npm](https://img.shields.io/github/stars/elraccoone/react-unity-webgl.svg?style=for-the-badge)]()
[![npm](https://img.shields.io/npm/dt/react-unity-webgl.svg?style=for-the-badge)]()

When building content for the web, you might need to communicate with elements on a webpage. Or you might want to implement functionality using Web APIs which Unity does not currently expose by default. In both cases, you need to directly interface with the browser’s JavaScript engine. React Unity WebGL provides an easy solution for embedding Unity WebGL builds in your React application, with two-way communication between your React and Unity application with advanced API's.

**&Lt;**
[**Documentation**](https://github.com/elraccoone/react-unity-webgl/wiki) &middot;
[**Test Environment**](https://github.com/jeffreylanters/react-unity-webgl-test)
**&Gt;**

<br/><br/>

[![npm](https://img.shields.io/badge/sponsor_the_project-donate-E12C9A.svg?style=for-the-badge)](https://paypal.me/jeffreylanters)

This package is an open source hobby project with ongoing development. A result of a long road and endless fight with Unity's updates since 2017, full of sleepless nights, working after hours, and busy weekends. If you're using this module for production, please consider donating to support the project. Thank you!

**&Lt;**
**Made with &hearts; by Jeffrey Lanters**
**&Gt;**

<br/><br/>

</div>

# Installation

Install using npm for your JavaScript (babel) and TypeScript React Project. Make sure you download the release matching with your Unity version. I try to update this plugin in case of need as fast as possible. For the corresponding, check the releases on [GitHub](https://github.com/elraccoone/react-unity-webgl/releases) or [NPM](https://www.npmjs.com/package/react-unity-webgl).

```sh
$ npm install react-unity-webgl
```

# Usage

To get started import the Unity and Unity Content class from the React Unity WebGL library. Create a new content object and assign it in your render function. For further intructions please head to the [documentation](https://github.com/elraccoone/react-unity-webgl/wiki) or go straight to the [quick start guide](https://github.com/elraccoone/react-unity-webgl/wiki/Quick-Start-Guide). Have fun coding!

```jsx
import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";

const unityContent = new UnityContent(
  "MyGame/Build.json",
  "MyGame/UnityLoader.js"
);

const App = () => {
  return <Unity unityContent={unityContent} />;
}
```


# Backers

This package is an open source hobby project with ongoing development. A result of a long road and endless fight with Unity's updates since 2017, full of sleepless nights, working after hours, and busy weekends. If you're using this module for production, please consider [donating](https://paypal.me/jeffreylanters) to support the project. Thank you!

[<img src="https://avatars2.githubusercontent.com/u/2016308?s=460&v=4" width="50" height="50" />](https://github.com/mrniket)
[<img src="https://avatars3.githubusercontent.com/u/20756439?s=460&v=4" width="50" height="50" />](https://github.com/webbertakken)
