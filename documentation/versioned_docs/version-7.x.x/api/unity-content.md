# Unity Content

When rendering a Unity Component, you have to specify which Unity build to run within the Content. To do so you have to create an Unity Content object. Within the object you can specify various parameters to tell the component how to render, what to render and how to handle events.

## Creating the Content

Creating a Unity Content object is simple, just create a new unityContent model and pass your UnityConfig with it.

```js
let unityContent = new UnityContent({
    "MyGame/Build.json",
    "MyGame/UnityLoader.js"
});
```

## Adding event listeners

You can add event listeners to each Unity Content. These event listeners can be invoked by our Unity application's JSLib file located in your Plugins directory, or by any of the Build in events. Click here to learn more about event system. An implementation could look something like:

```js
unityContent.on("GameOver", (score) => {
  // Do something...
});
```

## Sending messages to your Unity Content

The Unity Content object allows you to send messages back to your Unity Instance. The first paramater contains the name of the Game Object you want to send your message to. The seconds parameter contains the name of the public method attached to the game object in any of its components.

These message can contain an optional value to take full control of the two-way communication. You can read more about parameters and JavaScript to Unityscript types here. An implementation could look something like:

```js
unityContent.send("SpawnController", "StartGame");
unityContent.send("SpawnController", "SpawnEnemies", 100);
```

## Setting Fullscreen

The Unity Content object allows you to enable and disable the fullscreen mode of your application. Cursor locking (using Cursor.lockState) and full-screen mode are both supported in WebGL, implemented using the respective HTML5 APIs (Element.requestPointerLock and Element.requestFullscreen). These are supported in Firefox and Chrome. Safari cannot currently use full-screen and cursor locking. An implementation could look something like:

```js
unityContent.setFullscreen(true);
unityContent.setFullscreen(false);
```
