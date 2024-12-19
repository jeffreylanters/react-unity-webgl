import { Fragment, useEffect, useRef, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

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
    UNSAFE__unityInstance,
  } = useUnityContext({
    codeUrl: `/unity-build/communication-tests.wasm`,
    dataUrl: `/unity-build/communication-tests.data`,
    frameworkUrl: `/unity-build/communication-tests.framework.js`,
    loaderUrl: `/unity-build/communication-tests.loader.js`,
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
    cacheControl: handleCacheControl,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    function logParametersToConsole(...parameters: any[]) {
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
      Error: <code>{initialisationError?.message || "NONE"}</code>
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
      <h2>Unity</h2>
      <Unity
        unityProvider={unityProvider}
        style={{
          border: "1px solid red",
          height: 400,
          width: canvasWidth,
        }}
        devicePixelRatio={window.devicePixelRatio}
        disabledCanvasEvents={["dragstart"]}
        ref={canvasRef}
        id="my-custom-cancas-id"
      />
      <h2>Console</h2>
      <code>
        {consoleEntries.map((entry, index) => (
          <div key={index}>{entry}</div>
        ))}
      </code>
    </Fragment>
  );
}
