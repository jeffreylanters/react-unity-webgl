# JavaScript to UnityScript types

Simple numeric types can be passed to JavaScript in function parameters without requiring any conversion. Other data types will be passed as a pointer in the emscripten heap (which is really just a big array in JavaScript). For strings, you can use the Pointerstringify helper function to convert to a JavaScript string.

To return a string value you need to call \_malloc to allocate some memory and the writeStringToMemory helper function to write a JavaScript string to it. If the string is a return value, then the il2cpp runtime will take care of freeing the memory for you.

For arrays of primitive types, emscripten provides different ArrayBufferViews into it’s heap for different sizes of integer, unsigned integer or floating point representations of memory: HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64. To access a texture in WebGL, emscripten provides the GL.textures array which maps native texture IDs from Unity to WebGL texture objects. WebGL functions can be called on emscripten’s WebGL context, GLctx.

#### Example implementation

A basic implementation could look something like this. In this example a series of methods is merged into the Unity library making this methods availble in CSharp. Each of these methods contain an example on how to handle specific types of data. No worries, the methods used for the conversion such as "Pointer_stringify" and "HEAPF32" are available natively.

```js
// File: MyPlugin.jslib

mergeInto(LibraryManager.library, {
  GameOver: function () {
    window.UnityEvent("GameOver");
  },
  NextWave: function (waveNumberValue) {
    window.dispatchReactUnityEvent("NextWave", waveNumberValue);
  },
  ShowPopup: function (textStringPointer) {
    window.dispatchReactUnityEvent(
      "ShowPopup",
      Pointer_stringify(textStringPointer)
    );
  },
  SubmitScores: function (scoresFloatArrayPointer, arraySize) {
    var scores = [];
    for (var i = 0; i < arraySize; i++)
      scores.push(HEAPF32[(scoresFloatArrayPointer >> 2) + i]);
    window.dispatchReactUnityEvent("SubmitScores", scores);
  },
});
```
