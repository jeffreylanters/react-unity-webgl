# Unity Config

When creating an Unity Content object, a third optional parameters is reserved for an Unity Config object. This object contains additional configuration for your content. An implementation could look something like:

```js
let unityContent = new UnityContent(
  "MyGame/Build.json",
  "MyGame/UnityLoader.js", {
    ...
  }
);
```

## Streaming Assets URL

Setting the url where the streaming assets can be found allows the loading of Streaming Assets from a specific URL. When using a relative url, keep in mind this is relative from the path where your html file is served. An implementation could look something like:

```js
let unityContent = new UnityContent(
  "MyGame/Build.json",
  "MyGame/UnityLoader.js",
  {
    streamingAssetsUrl: "MyGame/StreamingAssets",
  }
);
```

## Modules

The module object will overwrite the Unity modules. An implementation could look something like:

```js
let unityContent = new UnityContent(
  "MyGame/Build.json",
  "MyGame/UnityLoader.js", {
    modules: {
      ...
    }
  }
);
```

## Adjust On Window Resize

since 7.0.6 Since the Unity canvas itself does not respond to the resizing of it's container the Unity component will do this for you. The canvas will be adjusted to the size of the parent element when the window is resized. Adjusting on window resize is turned on by default.

```js
let unityContent = new UnityContent(
  "MyGame/Build.json",
  "MyGame/UnityLoader.js",
  {
    adjustOnWindowResize: true,
  }
);
```

## Unity Version

There is a possibility that future releases of Unity need specific WebGL support. So I've give the option to pass your Unity Version so if some special treatment is needed, I exactly know which patches I should apply to your Unity project.

See the UnityVersions.ts file to all the available options. An implementation could look something like:

```js
let unityContent = new UnityContent(
  "MyGame/Build.json",
  "MyGame/UnityLoader.js",
  {
    unityVersion: "2019.1.5",
  }
);
```

## ID

The ID is currently unused but could be used in future releases. An implementation could look something like:

```js
let unityContent = new UnityContent(
  "MyGame/Build.json",
  "MyGame/UnityLoader.js",
  {
    id: "MyGame",
  }
);
```
