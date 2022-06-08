# Creating Unity WebGL builds

To get started with React Unity WebGL, you'll first need a Unity WebGL build. Nowadays with Unity 2020 and new, creating WebGL builds is easier then ever before. The following sections runs you though the basic steps of creating your very first WebGL build, and covers some frequently asked questions.

#### Setting the Target Build Platform

Start of by switching to the WebGL build platform, the target build platform can be changes from within the Build Settings window. This window can be found under the menu "File > Build Settings", or by pressing \[CMD+Shift+B\] on MacOS or \[CTRL+Shift+B\] on Windows respectively. When you've selected the WebGL build platform, proceed by clicking "Switch Platform". This process might take a while and will reimport your Assets.

#### Generated Files, Templates and Presentation Settings

When creating your WebGL build, Unity will by default generate a lot of files including HTML, CSS and a series of images. The reason these files are generated alongside your actual build is a selected Template from within your projects Player Settings. The same goes for the Height and Width settings. Unity allows for Templates to be added to your Asset directory and generate builds while bundeling them with these templates.

Since your React project is something entirely different, we're not going to need all these files, and we'll be focussing on the actual build instead. These files include the four files required by the Unity Context object. You can either use the Minimal template to reduse the number of unused file to be generated, or just ignore these files and only copy the files you'll need.

#### Builds Compression and Server Configuration

By default Unity compresses the generated files using the Brotli compression algorithm based on your Unity Version. Support for compressed files has nothing to do with this module but requires you to set up your server correctly. If you don't want to configure your server, you can disable compression from within the Player Setting's Publish section.

When chosing to use compressed builds, you might need to adjust your server configuration to match your specific build setup. In particular, there might be issues if you already have another server-side configuration to compress hosted files, which could interfere with this setup. To make the browser perform decompression natively while it downloads your application, append a Content-Encoding header to the server response. This header must correspond to the type of compression Unity uses at build time. For code samples, see Server Configuration Code Samples.

#### Runtime Debugging and Development Builds

When taking a look at the generated files, you'll find a lot of minified and mangled JavaScript. This might make debugging runtime issues quite challenging. Enable "Development Build" from the Player Settings window to prevent your build from becomming unreadable. This helps your debugging process, but these builds are not meant to be published since their buildsizes are hudge compaired to regular builds.

If you're having more questions about creating WebGL builds, feel free to take a look and open a new question on the [Discussion Board](https://github.com/jeffreylanters/react-unity-webgl/discussions).

<!-- ## Known Issues and Limitations

Active known issues and limitations will be documented here and will be linked to an issue or pull request. These issues include both Unity stand-alone as well as module problems. Once these issues are fixed on either side, they will be removed from the documentation.

- Builds made with Unity 2021.2 throws an error when removing the canvas before invoking Quit on the Unity Instance. Problem occurs within and outside of this module. An error is thrown when the canvas element is removed before invoking the Quit method on the Unity Instance. [#250](https://github.com/jeffreylanters/react-unity-webgl/issues/250)
- Some browsers will in combination with hot-module-reloading or server-side-rendering rescale the canvas's height indefinitely when no width or height is defined. To prevent this from happening provide these dimensions via either the style or className tag. The issues should not occur in production builds. [#233](https://github.com/jeffreylanters/react-unity-webgl/issues/233) -->
