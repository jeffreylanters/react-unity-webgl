import { FunctionComponent, useCallback, useEffect, useState } from "react";
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
    codeUrl: "/unitybuild-2020-1/example-app.wasm",
    dataUrl: "/unitybuild-2020-1/example-app.data",
    frameworkUrl: "/unitybuild-2020-1/example-app.framework.js",
    loaderUrl: "/unitybuild-2020-1/example-app.loader.js",
  });

  const [rotation, setRotation] = useState(0);

  const handleClickedPosition = useCallback((x: number, y: number) => {
    console.log("Clicked Position:", { x, y });
  }, []);

  useEffect(() => {
    addEventListener("RotationDidUpdate", setRotation);
    addEventListener("ClickedPosition", handleClickedPosition);
    return () => {
      removeEventListener("RotationDidUpdate", setRotation);
      removeEventListener("ClickedPosition", handleClickedPosition);
    };
  }, [addEventListener, removeEventListener, handleClickedPosition]);

  return (
    <div>
      <h2>Unity Test</h2>
      <p>Loading progression: {loadingProgression}</p>
      <p>Loaded?: {isLoaded ? "Y" : "N"}</p>
      <p>Error: {initialisationError || "None"}</p>
      <p>Rotation: {rotation}deg</p>
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
