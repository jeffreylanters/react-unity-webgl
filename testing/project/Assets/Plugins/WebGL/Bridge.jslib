mergeInto(LibraryManager.library, {
  ClickedTestButton: function () {
    dispatchReactUnityEvent("ClickedTestButton");
  },
  ClickedStringTestButton: function (value) {
    dispatchReactUnityEvent("ClickedStringTestButton", UTF8ToString(value));
  },
  ClickedNumberTestButton: function (value) {
    dispatchReactUnityEvent("ClickedNumberTestButton", value);
  },
  ClickedNumbersTestButton: function (values, length) {
    var array = new Array(length);
    for (var i = 0; i < length; i++) {
      array[i] = HEAPF32[(array >> 2) + i];
    }
    dispatchReactUnityEvent("ClickedNumbersTestButton", array);
  },
  ClickedBoolTestButton: function (value) {
    dispatchReactUnityEvent("ClickedBoolTestButton", value === 1);
  },
  ClickedObjectTestButton: function (stringValue, intValue, boolValue) {
    dispatchReactUnityEvent("ClickedObjectTestButton", {
      stringValue: UTF8ToString(stringValue),
      intValue: intValue,
      boolValue: boolValue === 1,
    });
  },
  ClickedTestButtonReturnString: function () {
    var returnStr = dispatchReactUnityEvent("ClickedTestButtonReturnString");
    var bufferSize = lengthBytesUTF8(returnStr) + 1;
    var buffer = _malloc(bufferSize);
    stringToUTF8(returnStr, buffer, bufferSize);
    return buffer;
  },
});
