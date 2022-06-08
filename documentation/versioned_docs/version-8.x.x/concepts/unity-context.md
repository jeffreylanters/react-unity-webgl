# Unity Context

When wanting to render a Unity Application within your React Application, you will need to pass along the Unity Context Object to the Unity Component. The Unity Context Object is the heart of the implementation. This is were all of your configuration, event listeners and references will be stored.

When passing the Unity Context Object to the Unity Component, it will take the configuration and starts loading the required resources in order to render your Unity Application. During this process, the Unity Context Object will be updated with the Unity Application's state and will invoke various events which can all be found in the documentation.

> Make sure to create your Unity Context object either somewhere outside of your component, or in a component did mount cycle to prevent it from being created multiple times thus losing a reference to the Unity Instance.

When creating a new Unity Context object, you'll need to pass a Unity Config boject. A most basic Unity Config consists the following four properties. These four properties are all URLs to the required Unity Build resources.

- The **Loader URL**, this is a JavaScript file which contains the Unity Engine bootstrapping code. This file is required to load the Unity Engine and start the initialization process.
- The **Framework URL**, this is a JavaScript file which contains the Runtime and Plugin code. This file is responsible for running the actual Unity Application.
- The **Data URL**, this is a JSON file which contains the initial Unity Application state including your Assets and Scenes. This file can get big really fast so try to optimize your game's assets as much as possible. Try using both building and runtime compression techniques and usefull packages such as sprite atlasses.
- The **Code URL**, this a Web Assembly binary file containg native code.

There are many more properties you can pass to the Unity Config object. These properties are all optional and can be found in the documentation.

Sounds complicated? No worries, you don't need to remember any of the meanings behind these files. The module will take care of all of this for you. Just add the paths to the files to the Unity Context, sit back and enjoy!

> All of the URLs, including the ones mentioned above, are due to their enormous size **NOT loaded into your bundle**. You should place these files in a public directory within your project or use a CDN. This means the files behind these URLs are loaded during runtime and should be accessible by a the browser via a public URL.
