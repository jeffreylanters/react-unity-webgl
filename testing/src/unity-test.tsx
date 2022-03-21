import { FunctionComponent } from "react";
import { Unity, useUnityContext } from "react-unity-webgl/distribution/exports";

const UnityTest: FunctionComponent = () => {
  const {
    loadingProgression,
    unityProvider,
    isLoaded,
    setFullscreen,
    sendMessage,
  } = useUnityContext({
    codeUrl: "/unitybuild/myunityapp.wasm",
    dataUrl: "/unitybuild/myunityapp.data",
    frameworkUrl: "/unitybuild/myunityapp.framework.js",
    loaderUrl: "/unitybuild/myunityapp.loader.js",
  });

  return (
    <div>
      <h2>Unity Test</h2>
      <p>Loading progression: {loadingProgression}</p>
      <p>Loaded?: {isLoaded ? "Y" : "N"}</p>
      <div>
        <button onClick={() => setFullscreen(true)}>Fullscreen</button>
        <button
          children="Normal"
          onClick={() => sendMessage("MeshCrate", "SetRotationSpeed", 50)}
        />
        <button
          children="Fast"
          onClick={() => sendMessage("MeshCrate", "SetRotationSpeed", 200)}
        />
      </div>
      <Unity
        unityProvider={unityProvider}
        style={{ border: "1px solid red", height: 300, width: 400 }}
      />
    </div>
  );
};

export { UnityTest };
