import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Unity, useUnityContext } from "react-unity-webgl/distribution/exports";

const UnityTest: FunctionComponent = () => {
  const {
    loadingProgression,
    unityProvider,
    isLoaded,
    requestFullscreen,
    requestPointerLock,
    sendMessage,
    initialisationError,
    addEventListener,
    removeEventListener,
    takeScreenshot,
  } = useUnityContext({
    codeUrl: "/unitybuild-2020-1/example-app.wasm",
    dataUrl: "/unitybuild-2020-1/example-app.data",
    frameworkUrl: "/unitybuild-2020-1/example-app.framework.js",
    loaderUrl: "/unitybuild-2020-1/example-app.loader.js",
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });

  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      <p>Rotation: {Math.round(rotation)}deg</p>
      <p>
        Canvas Reference
        <button onClick={() => console.log({ canvasRef: canvasRef.current })}>
          Log to Console
        </button>
      </p>
      <p>
        Actions
        <button onClick={() => requestFullscreen(true)}>
          Request Fullscreen
        </button>
        <button onClick={() => requestPointerLock()}>
          Request Pointer Lock
        </button>
        <button onClick={() => console.log(takeScreenshot("image/jpg", 1))}>
          Screenshot
        </button>
        <button
          children="Normal"
          onClick={() => sendMessage("MeshCrate", "SetRotationSpeed", 50)}
        />
        <button
          children="Fast"
          onClick={() => sendMessage("MeshCrate", "SetRotationSpeed", 200)}
        />
      </p>
      <Unity
        unityProvider={unityProvider}
        style={{ border: "1px solid red", height: 300, width: 400 }}
        ref={canvasRef}
      />
    </div>
  );
};

export { UnityTest };
