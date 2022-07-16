import { Fragment, useState } from "react";
import { UnityTest } from "./unity-test";

const App = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [unityBuildPath, setUnityBuildPath] = useState("");
  const [repaintCounter, setRepaintCounter] = useState(0);

  console.log("App is being painted!");

  function handleClickMount(unityBuildPath: string) {
    setUnityBuildPath(unityBuildPath);
    setIsMounted(true);
  }

  function handleClickUnmount() {
    setIsMounted(false);
  }

  return (
    <Fragment>
      <h1>App</h1>
      <button onClick={() => setRepaintCounter((i) => i + 1)}>
        Force Repaint ({repaintCounter})
      </button>
      {isMounted === true ? (
        <Fragment>
          <button onClick={handleClickUnmount}>Unmount Unity Test</button>
          <UnityTest unityBuildPath={unityBuildPath} />
        </Fragment>
      ) : (
        <Fragment>
          <button onClick={() => handleClickMount("unitybuild-2020-1")}>
            Mount Unity 2020.1 Test
          </button>
          <button onClick={() => handleClickMount("unitybuild-2021-2")}>
            Mount Unity 2021.2 Test
          </button>
        </Fragment>
      )}
    </Fragment>
  );
};

export { App };
