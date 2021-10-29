import { useEffect, useState } from "react";

export enum Status {
  Idle = "Idle",
  Loading = "Loading",
  Loaded = "Loaded",
  Error = "Error",
}

/**
 * Hook to embed a Unity Loader script.
 * @param src The source of the unity loader
 * @returns a hook that returns the status of the loader
 */
export function useUnityLoader(src: string): Status {
  const [status, setStatus] = useState<Status>(
    src ? Status.Loading : Status.Idle
  );

  // Effect hook will be invoked when the src changes.
  useEffect(
    function () {
      if (src === null) {
        setStatus(Status.Idle);
        return;
      }

      // Fetch existing script element by src
      // It may have been added by another instance of this hook
      let script: HTMLScriptElement | null = document.querySelector(
        `script[src="${src}"]`
      );

      if (script === null) {
        // Create script
        script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.setAttribute("data-status", "loading");
        // Add script to document body
        document.body.appendChild(script);

        // Store status in attribute on script
        // This can be read by other instances of this hook
        const setAttributeFromEvent = function (event: Event) {
          script?.setAttribute(
            "data-status",
            event.type === "load" ? "ready" : "error"
          );
        };

        script.addEventListener("load", setAttributeFromEvent);
        script.addEventListener("error", setAttributeFromEvent);
      } else {
        // Grab existing script status from attribute and set to state.
        setStatus(
          script.getAttribute("data-status") === "ready"
            ? Status.Loaded
            : Status.Error
        );
      }

      // Script event handler to update status in state
      // Note: Even if the script already exists we still need to add
      // event handlers to update the state for *this* hook instance.
      const setStateFromEvent = function (event: Event) {
        setStatus(event.type === "load" ? Status.Loaded : Status.Error);
      };

      // Add event listeners
      script.addEventListener("load", setStateFromEvent);
      script.addEventListener("error", setStateFromEvent);

      // Remove event listeners on cleanup
      return function () {
        if (script) {
          script.removeEventListener("load", setStateFromEvent);
          script.removeEventListener("error", setStateFromEvent);
          document.body.removeChild(script);
        }
      };
    },
    [src] // Only re-run effect if script src changes
  );

  return status;
}
