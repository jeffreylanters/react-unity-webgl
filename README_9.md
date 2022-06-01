<div align="center">

![readme splash](https://raw.githubusercontent.com/jeffreylanters/react-unity-webgl/main/.github/WIKI/repository-readme-splash.png)

[![license](https://img.shields.io/badge/license-Apache_2.0-red.svg?style=for-the-badge)](https://github.com/jeffreylanters/react-unity-webgl/blob/main/LICENSE.md)
[![npm](https://img.shields.io/npm/v/react-unity-webgl.svg?style=for-the-badge)](https://www.npmjs.com/package/react-unity-webgl)
[![build](https://img.shields.io/github/workflow/status/jeffreylanters/react-unity-webgl/Pre-Compile%20and%20Lint?style=for-the-badge)](https://github.com/jeffreylanters/react-unity-webgl/actions)
[![deployment](https://img.shields.io/github/deployments/jeffreylanters/react-unity-webgl/Node%20Package%20Registry?style=for-the-badge)](https://github.com/jeffreylanters/react-unity-webgl/deployments/activity_log?environment=Node+Package+Registry)
[![stars](https://img.shields.io/github/stars/jeffreylanters/react-unity-webgl.svg?style=for-the-badge&color=fe8523&label=stargazers)](https://github.com/jeffreylanters/react-unity-webgl/stargazers)
[![downloads](https://img.shields.io/npm/dt/react-unity-webgl.svg?style=for-the-badge&color=40AA72)](https://www.npmtrends.com/react-unity-webgl)
[![size](https://img.shields.io/bundlephobia/minzip/react-unity-webgl?style=for-the-badge&label=size)](https://bundlephobia.com/result?p=react-unity-webgl)
[![sponsors](https://img.shields.io/github/sponsors/jeffreylanters?color=E12C9A&style=for-the-badge)](https://github.com/sponsors/jeffreylanters)
[![donate](https://img.shields.io/badge/donate-paypal-F23150?style=for-the-badge)](https://paypal.me/jeffreylanters)

React Unity WebGL provides a modern solution for embedding Unity WebGL builds in your React Application while providing advanced APIs for two way communication and interaction between Unity and React.

[**Documentation**](https://react-unity-webgl.jeffreylanters.nl/docs/introduction) &middot;
[**Example Templates**](https://github.com/jeffreylanters/react-unity-webgl-templates/) &middot;
[**Sponsor the Project**](https://github.com/sponsors/jeffreylanters) &middot;
[**Discussion Board**](https://github.com/jeffreylanters/react-unity-webgl/discussions)

**Made with &hearts; by Jeffrey Lanters**

</div>

When bringing your Unity Application to the web, you might need to communicate with Components on a webpage, build interactive interfaces or might want to implement functionality using Web APIs which Unity does not expose. Combining Unity with React is a great way achieve these goals. React Unity WebGL provides a modern solution for embedding Unity WebGL builds in your React Application while providing advanced APIs for two way communication and interaction between Unity and React.

### A quick word

Hi there! I would like to say one more thing before you start bringing your awesome games to the web. My name is Jeffrey, I'm a Unity and Web developer with a passion for Open Source. The project you're looking at right now is one of my hobby projects. Maintaining and building this project is something I do in my spare time, and I have been doing so since 2017. React-Unity-WebGL will always remain free, but maining it and keeping up-to-date with Unity's updates takes a lot of work and tine. If you are able to, I would appreciate it greatly if you would consider [sending a donation](https://paypal.me/jeffreylanters) or [becoming a sponsor](https://github.com/sponsors/jeffreylanters) to help me keep this project going.

Thanks for your time, happy coding!

# Installation

Get started by installing React Unity WebGL using the Node Package Manager or Yarn in your JavaScript or TypeScript React project. If you don't have a React project yet, I recommend using [Creat React App](https://reactjs.org/docs/create-a-new-react-app.html) to get you started right away.

Before installing the module, make sure you're installing a version which is compatible with your build's Unity version. When a new Unity version releases, I'll update the module as soon as possible in order to keep the compatibility. If you are running into any issues, please open an issue on the [React Unity WebGL Github page](https://github.com/jeffreylanters/react-unity-webgl/issues).

```sh
% npm install react-unity-webgl
```

### Legacy versions

Version 9 and above of the module is compatibly with Unity 2020 and above. If you're using an older version of Unity, or you have to maintain an project built with an older version of the module, you can use one of the legacy versions of React Unity WebGL. It however is recommended to update your project to a newer version of Unity in order to use all the latest features of React Unity WebGL.

React Unity WebGL has been rewritten completely with support for React Hooks in module version 9. Due to an overhaul of the entire API, the documentation for prior versions has been seperated. Head over to the [legacy docs](https://react-unity-webgl.jeffreylanters.nl/docs/legacy/introduction) to learn more about the legacy versions of React Unity WebGL.
