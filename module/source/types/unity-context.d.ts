import { UnityProvider } from "./unity-provider";

type UnityContext = {
  /**
   * The Unity Context returns a Unity Provider instance. This immutable object
   * should be passed onto a Unity Component in order to be able to access the
   * Unity Context's state.
   */
  readonly unityProvider: UnityProvider;
};

export type { UnityContext };
