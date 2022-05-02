mergeInto(LibraryManager.library, {
  RotationDidUpdate: function (degrees) {
    dispatchReactUnityEvent("RotationDidUpdate", degrees);
  },
  Say: function (message) {
    dispatchReactUnityEvent("Say", Pointer_stringify(message));
  },
  ClickedPosition: function (x, y) {
    dispatchReactUnityEvent("ClickedPosition", x, y);
  }
});
