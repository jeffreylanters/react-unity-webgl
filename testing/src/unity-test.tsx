import { useEffect, useRef, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl/distribution/exports";

function UnityTest() {
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
    unload,
  } = useUnityContext({
    codeUrl: `/unity-build/communication-tests.wasm`,
    dataUrl: `/unity-build/communication-tests.data`,
    frameworkUrl: `/unity-build/communication-tests.framework.js`,
    loaderUrl: `/unity-build/communication-tests.loader.js`,
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screenshots, setScreenshots] = useState<string[]>([]);

  const handleClickRequestFullScreen = () => requestFullscreen(true);
  const handleClickRequestPointerLock = () => requestPointerLock();
  const handleClickSetLogText = () =>
    sendMessage("Persistent", "SetLogText", "Hello World!");

  function handleClickTakeScreenshot() {
    const screenshot = takeScreenshot("image/jpg", 1);
    if (screenshot) {
      setScreenshots([...screenshots, screenshot]);
    }
  }

  useEffect(() => {
    function logParametersToConsole(...parameters: any[]) {
      console.log({ parameters });
    }

    addEventListener("ClickedTestButton", logParametersToConsole);
    addEventListener("ClickedStringTestButton", logParametersToConsole);
    addEventListener("ClickedNumberTestButton", logParametersToConsole);
    addEventListener("ClickedNumbersTestButton", logParametersToConsole);
    addEventListener("ClickedBoolTestButton", logParametersToConsole);
    addEventListener("ClickedObjectTestButton", logParametersToConsole);
    return () => {
      removeEventListener("ClickedTestButton", logParametersToConsole);
      removeEventListener("ClickedStringTestButton", logParametersToConsole);
      removeEventListener("ClickedNumberTestButton", logParametersToConsole);
      removeEventListener("ClickedNumbersTestButton", logParametersToConsole);
      removeEventListener("ClickedBoolTestButton", logParametersToConsole);
      removeEventListener("ClickedObjectTestButton", logParametersToConsole);
    };
  }, [addEventListener, removeEventListener]);

  return (
    <div>
      <h2>Unity Test</h2>
      <p>Loading progression: {loadingProgression}</p>
      <p>Loaded?: {isLoaded ? "Yes!" : "No"}</p>
      <p>Error: {initialisationError || "None"}</p>
      <p>
        Canvas Reference
        <button onClick={() => console.log({ canvasRef: canvasRef.current })}>
          Log to Console
        </button>
      </p>
      <p>
        Actions
        <button onClick={handleClickRequestFullScreen}>
          Request Fullscreen
        </button>
        <button onClick={handleClickRequestPointerLock}>
          Request Pointer Lock
        </button>
        <button onClick={() => unload()}>Unload...</button>
      </p>
      <p>
        Screenshots:
        <button onClick={handleClickTakeScreenshot}>Take Screenshot</button>
        {screenshots.map((screenshot, index) => (
          <img key={index} src={screenshot} height={50} alt="Screenshot" />
        ))}
      </p>
      <p>
        Communication:
        <button onClick={handleClickSetLogText}>Set Log Text</button>
      </p>
      <Unity
        unityProvider={unityProvider}
        style={{ border: "1px solid red", height: 400, width: 500 }}
        devicePixelRatio={window.devicePixelRatio}
        ref={canvasRef}
      />
    </div>
  );
}

export { UnityTest };
