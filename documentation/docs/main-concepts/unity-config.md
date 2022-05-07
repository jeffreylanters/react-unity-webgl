# Unity Config

When rendering your Unity Application within a React Application, you'll have to pass along the Unity Provider to the Unity Component. When the Unity Component is being mounted, it will take the Unity Context's configuration and initialises the required resources in order to render your Unity Application. During this process, the Unity Context's state will be updated to reflect the Unity Application's.

When using the Unity Context hook, you'll need to provide a Unity Config object. A most basic Unity Config consists the four following properties. These four properties are all URLs which are required to initialise the Unity Application.

- The **`LoaderUrl`**, this is a JavaScript file which contains the Unity Engine bootstrapping code. This file is required to load the Unity Engine and start the initialization process.
- The **`FrameworkUrl`**, this is a JavaScript file which contains the Runtime and Plugin code. This file is responsible for running the actual Unity Application.
- The **`DataUrl`**, this is a JSON file which contains the initial Unity Application state including your Assets and Scenes. This file can get big really fast so try to optimize your game's assets as much as possible. Try using both building and runtime compression techniques and usefull packages such as sprite atlasses.
- The **`CodeUrl`**, this a Web Assembly binary file containg native code.

:::caution
All of the URLs which can be provided to the Unity Config, including the ones mentioned above, are due to their enormous size **not included into your bundle**. You should place these files in a public directory within your project or use a CDN. This means the files behind these URLs are loaded during runtime and should be accessible by the browser via a public URL.
:::

There are many more properties you can pass to the Unity Config object. These properties are all optional and can be found in the documentation.

Sounds complicated? No worries, you don't need to remember any of the meanings behind these files. The module will take care of all of this for you. Just add the paths to the files to the Unity Context, sit back and enjoy!
