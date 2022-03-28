import { FunctionComponent, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl/distribution/exports";

const UnityTest: FunctionComponent = () => {
  const {
    loadingProgression,
    unityProvider,
    isLoaded,
    setFullscreen,
    sendMessage,
    initialisationError,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    codeUrl: "/unitybuild-2020-1/myunityapp.wasm",
    dataUrl: "/unitybuild-2020-1/myunityapp.data",
    frameworkUrl: "/unitybuild-2020-1/myunityapp.framework.js",
    loaderUrl: "/unitybuild-2020-1/myunityapp.loader.js",
  });

  const handleRotationDidUpdate = useCallback((rotation: number) => {
    console.log("Rotation did update:", rotation);
  }, []);

  useEffect(() => {
    addEventListener("RotationDidUpdate", handleRotationDidUpdate);
    return () => {
      removeEventListener("RotationDidUpdate", handleRotationDidUpdate);
    };
  }, [addEventListener, removeEventListener, handleRotationDidUpdate]);

  return (
    <div>
      <h2>Unity Test</h2>
      <p>Loading progression: {loadingProgression}</p>
      <p>Loaded?: {isLoaded ? "Y" : "N"}</p>
      <p>Error: {initialisationError || "None"}</p>
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
