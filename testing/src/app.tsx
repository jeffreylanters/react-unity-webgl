import { Fragment, FunctionComponent, useState } from "react";
import { UnityTest } from "./unity-test";

const App: FunctionComponent = () => {
  const [isUnityTestMounted, setIsUnityTestMounted] = useState(false);
  const [repaintCounter, setRepaintCounter] = useState(0);

  console.log("App is being painted!");

  return (
    <Fragment>
      <h1>App</h1>
      <button onClick={() => setIsUnityTestMounted((s) => !s)}>
        (Un)mount Unity Test
      </button>
      <button onClick={() => setRepaintCounter((i) => i + 1)}>
        Force Repaint ({repaintCounter})
      </button>
      {isUnityTestMounted === true && <UnityTest />}
    </Fragment>
  );
};

export { App };
