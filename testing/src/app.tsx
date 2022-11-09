import { Fragment, useState } from "react";
import { UnityTest } from "./unity-test";

function App() {
  const [isMounted, setIsMounted] = useState(false);
  const [repaintCounter, setRepaintCounter] = useState(0);

  function handleClickToggleMount() {
    setIsMounted(!isMounted);
  }

  return (
    <Fragment>
      <h1>React Unity WebGL Test</h1>
      <button onClick={handleClickToggleMount}>
        {isMounted ? "Unmount" : "Mount"} Unity App
      </button>
      <button onClick={() => setRepaintCounter((i) => i + 1)}>
        Force Repaint App ({repaintCounter})
      </button>
      {isMounted && <UnityTest />}
    </Fragment>
  );
}

export { App };
