import { Fragment, useEffect, useRef, useState } from "react";
import {
  Unity,
  UnityEventParameter,
  useUnityContext,
  useUnityMetricsInfo,
} from "../../module/source/exports";

export function Application() {
  function handleCacheControl(url: string) {
    console.log(`Cache control for ${url}`);
    return "no-cache";
  }

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
    getMetricsInfo,
    UNSAFE__unityInstance,
  } = useUnityContext({
    codeUrl: `/unity-build-6000.1/communication.wasm`,
    dataUrl: `/unity-build-6000.1/communication.data`,
    frameworkUrl: `/unity-build-6000.1/communication.framework.js`,
    loaderUrl: `/unity-build-6000.1/communication.loader.js`,
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
    cacheControl: handleCacheControl,
    companyName: "Unity Technologies",
    productName: "Communication Tests",
    productVersion: "1.0.0",
    autoSyncPersistentDataPath: true,
    // memoryUrl: `/unity-build/communication-tests.mem`, // <- Tested, but not implemented in the demo project
    // streamingAssetsUrl: `/unity-build/StreamingAssets`, // <- Tested, but not implemented in the demo project
    // symbolsUrl: `/unity-build/communication-tests.symbols.json`, // <- Tested, but not implemented in the demo project
    // workerUrl: `/unity-build/communication-tests.worker.js`, // <- Tested, but not implemented in the demo project
  });

  const { fps } = useUnityMetricsInfo(getMetricsInfo, {
    interval: 1000 / 60,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(true);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [consoleEntries, setConsoleEntries] = useState<string[]>([]);
  const [canvasWidth, setCanvasWidth] = useState(500);

  function handleClickRequestFullScreen() {
    requestFullscreen(true);
  }

  function handleClickRequestPointerLock() {
    requestPointerLock();
  }

  function handleClickUnload() {
    unload();
  }

  function handleClickSetRandomCanvasWidth() {
    console.log();
    setCanvasWidth(Math.floor(Math.random() * 500) + 250);
  }

  function handleClickSetLogText() {
    sendMessage(
      "Persistent",
      "SetLogText",
      "Hello World, the time is " + new Date().toISOString()
    );
  }

  function handleClickLogCanvasRefToConsole() {
    console.log("Canvas Reference", { canvasRef: canvasRef.current });
  }

  function handleClickLogUnityInstanceRefToConsole() {
    console.log("Unity Instance Reference", { UNSAFE__unityInstance });
  }

  function handleClickTakeScreenshot() {
    const screenshot = takeScreenshot("image/jpg", 1);
    if (screenshot) {
      setScreenshots([...screenshots, screenshot]);
    }
  }

  useEffect(() => {
    function logParametersToConsole(...parameters: UnityEventParameter[]) {
      setConsoleEntries((entries) => [
        ...entries,
        `Event: ${parameters.join(", ")}`,
      ]);
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
    <Fragment>
      <h1>Unity Test</h1>
      <h2>State</h2>
      Loading progression: <code>{loadingProgression}</code>
      <br />
      Loaded: <code>{isLoaded ? "YES" : "NO"}</code>
      <br />
      Error: <code>{initialisationError?.message ?? "NONE"}</code>
      <br />
      <h2>Actions</h2>
      References:
      <button onClick={handleClickLogCanvasRefToConsole}>
        Log Canvas Ref to Console
      </button>
      <button onClick={handleClickLogUnityInstanceRefToConsole}>
        (Unsafe) Log Unity Instance Ref to Console
      </button>
      <br />
      Actions:
      <button onClick={handleClickRequestFullScreen}>Request Fullscreen</button>
      <button onClick={handleClickRequestPointerLock}>
        Request Pointer Lock
      </button>
      <button onClick={handleClickUnload}>Unload</button>
      <br />
      Screenshots:
      <button onClick={handleClickTakeScreenshot}>Take Screenshot</button>
      {screenshots.map((screenshot, index) => (
        <img key={index} src={screenshot} height={50} alt="Screenshot" />
      ))}
      <br />
      Communication:
      <button onClick={handleClickSetLogText}>Set Log Text</button>
      <br />
      Other:
      <button onClick={handleClickSetRandomCanvasWidth}>
        Set Random Canvas Width
      </button>
      <button onClick={() => setIsMounted(!isMounted)}>
        {isMounted ? "Unmount" : "Mount"} Unity Component
      </button>
      <h2>Metrics Info</h2>
      <code>{Math.round(fps ?? -1)} FPS</code>
      <h2>Unity</h2>
      {isMounted && (
        <Unity
          unityProvider={unityProvider}
          style={{
            border: "1px solid red",
            height: 400,
            width: canvasWidth,
          }}
          devicePixelRatio={window.devicePixelRatio}
          ref={canvasRef}
          // id="my-custom-cancas-id" // <- Tested, but not implemented in the demo project
          matchWebGLToCanvasSize={true}
          disabledCanvasEvents={["contextmenu"]}
          className="my-custom-canvas-class"
          tabIndex={0}
        />
      )}
      <h2>Console</h2>
      <code>
        {consoleEntries.map((entry, index) => (
          <div key={index}>{entry}</div>
        ))}
      </code>
    </Fragment>
  );
}
