import { useEffect, useState } from "react";
import { isBrowserEnvironment } from "../constants/is-browser-environment";
import { UnityLoaderStatus } from "../enums/unity-loader-status";

/**
 * Hook to embed a Unity Loader script.
 * @param source The source of the unity loader.
 * @returns a hook that returns the status of the loader.
 */
const useUnityLoader = (source: string): UnityLoaderStatus => {
  const [status, setStatus] = useState<UnityLoaderStatus>(
    UnityLoaderStatus.Loading
  );
  // Effect hook will be invoked when the source changes.
  useEffect(() => {
    // It is possible for the application being rendered server side. In
    // this scenario, the window is not available. We can't create a Unity
    // Loader in this case.
    if (isBrowserEnvironment === false) {
      return;
    }
    // If the script's source is null, we'll reset the status to idle.
    if (source === null) {
      setStatus(UnityLoaderStatus.Idle);
      return;
    }
    /**
     * Find existing script element by source. It may have been added by
     * another instance of this hook.
     */
    let script: HTMLScriptElement | null = window.document.querySelector(
      `script[src="${source}"]`
    );
    // If there wan't another instance of this script, we're going to create a
    // new one with the provided source.
    if (script === null) {
      script = window.document.createElement("script");
      script.src = source;
      script.async = true;
      script.setAttribute("data-status", "loading");
      // Add script to window.document body.
      window.document.body.appendChild(script);
      // Store status in attribute on script. This can be read by other
      // instances of this hook.
      script.addEventListener("load", () =>
        script?.setAttribute("data-status", "loaded")
      );
      script.addEventListener("error", () =>
        script?.setAttribute("data-status", "error")
      );
    } else {
      // If there already was a script with the same source, grab its existing
      // script status from attribute and set to state.
      setStatus(
        script.getAttribute("data-status") === "loaded"
          ? UnityLoaderStatus.Loaded
          : UnityLoaderStatus.Error
      );
    }
    /**
     * Script event handler to update status in state. Even if the script
     * already exists we still need to add event handlers to update the state
     * for this hook instance.
     * @param event The event that was triggered.
     */
    const setStateFromEvent = (event: Event) =>
      setStatus(
        event.type === "load"
          ? UnityLoaderStatus.Loaded
          : UnityLoaderStatus.Error
      );
    script.addEventListener("load", setStateFromEvent);
    script.addEventListener("error", setStateFromEvent);
    // Remove event listeners on cleanup.
    return () => {
      if (script !== null) {
        script.removeEventListener("load", setStateFromEvent);
        script.removeEventListener("error", setStateFromEvent);
        window.document.body.removeChild(script);
      }
    };
  }, [source]);

  return status;
};

export { useUnityLoader };
