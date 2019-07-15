<div align="center">

<img src="https://raw.githubusercontent.com/elraccoone/react-unity-webgl/master/.github/WIKI/logo.png" height="300px"></br>

[![Financial Contributors on Open Collective](https://opencollective.com/react-unity-webgl/all/badge.svg?style=for-the-badge)](https://opencollective.com/react-unity-webgl) [![license](https://img.shields.io/badge/license-Apache_2.0-red.svg?style=for-the-badge)]()
[![npm](https://img.shields.io/npm/v/react-unity-webgl.svg?style=for-the-badge)]()
[![npm](https://img.shields.io/badge/build-passing-brightgreen.svg?style=for-the-badge)]()
<br/>
[![npm](https://img.shields.io/github/stars/elraccoone/react-unity-webgl.svg?style=for-the-badge)]()
[![npm](https://img.shields.io/npm/dt/react-unity-webgl.svg?style=for-the-badge)]()

When building content for the web, you might need to communicate with elements on a webpage. Or you might want to implement functionality using Web APIs which Unity does not currently expose by default. In both cases, you need to directly interface with the browser’s JavaScript engine. React Unity WebGL provides an easy solution for embedding Unity WebGL builds in your React application, with two-way communication between your React and Unity application with advanced API's.

**This package is an open source hobby project with ongoing development. A result of a long road since 2017, full of sleepless nights, working after hours, and busy weekends. If you're using this module for production, please consider [donating](https://paypal.me/jeffreylanters) to support the project. Thank you!** 🥳

**&Lt;**
[**Documentation**](https://github.com/elraccoone/react-unity-webgl/wiki) &middot;
[**Test Environment**](https://github.com/jeffreylanters/react-unity-webgl-test) &middot;
[**My other Modules**](https://github.com/elraccoone)
**&Gt;**

Made with &hearts; by Jeffrey Lanters

</div></br></br>

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

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.unityContent = new UnityContent(
      "MyGame/Build.json",
      "MyGame/UnityLoader.js"
    );
  }

  render() {
    return <Unity unityContent={this.unityContent} />;
  }
}
```

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/elraccoone/react-unity-webgl/graphs/contributors"><img src="https://opencollective.com/react-unity-webgl/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/react-unity-webgl/contribute)]

#### Individuals

<a href="https://opencollective.com/react-unity-webgl"><img src="https://opencollective.com/react-unity-webgl/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/react-unity-webgl/contribute)]

<a href="https://opencollective.com/react-unity-webgl/organization/0/website"><img src="https://opencollective.com/react-unity-webgl/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/react-unity-webgl/organization/1/website"><img src="https://opencollective.com/react-unity-webgl/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/react-unity-webgl/organization/2/website"><img src="https://opencollective.com/react-unity-webgl/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/react-unity-webgl/organization/3/website"><img src="https://opencollective.com/react-unity-webgl/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/react-unity-webgl/organization/4/website"><img src="https://opencollective.com/react-unity-webgl/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/react-unity-webgl/organization/5/website"><img src="https://opencollective.com/react-unity-webgl/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/react-unity-webgl/organization/6/website"><img src="https://opencollective.com/react-unity-webgl/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/react-unity-webgl/organization/7/website"><img src="https://opencollective.com/react-unity-webgl/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/react-unity-webgl/organization/8/website"><img src="https://opencollective.com/react-unity-webgl/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/react-unity-webgl/organization/9/website"><img src="https://opencollective.com/react-unity-webgl/organization/9/avatar.svg"></a>
