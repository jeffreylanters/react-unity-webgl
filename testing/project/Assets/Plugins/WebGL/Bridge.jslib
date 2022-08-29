
  [DllImport ("__Internal")] static extern void ClickedTestButton ();
  [DllImport ("__Internal")] static extern void ClickedStringTestButton (string value);
  [DllImport ("__Internal")] static extern void ClickedNumberTestButton (int value);
  [DllImport ("__Internal")] static extern void ClickedNumbersTestButton (int[] values);
  [DllImport ("__Internal")] static extern void ClickedBoolTestButton (bool value);
  [DllImport ("__Internal")] static extern void ClickedObjectTestButton (string stringValue, int intValue, bool boolValue);

mergeInto(LibraryManager.library, {
  ClickedTestButton: function() {
    dispatchReactUnityEvent("ClickedTestButton");
  },
  ClickedStringTestButton: function(value) {
    dispatchReactUnityEvent("ClickedStringTestButton", UTF8ToString(value));
  },
  ClickedNumberTestButton: function(value) {
    dispatchReactUnityEvent("ClickedNumberTestButton", value);
  },
  ClickedNumbersTestButton: function(values, length) {
    var array = new Array(length);
    for(var i = 0; i < size; i++) {
      array[i] = HEAPF32[(array >> 2) + i]
    }
    dispatchReactUnityEvent("ClickedNumbersTestButton", array);
  },
  ClickedBoolTestButton: function(value) {
    dispatchReactUnityEvent("ClickedBoolTestButton", value);
  },
  ClickedObjectTestButton: function(stringValue, intValue, boolValue) {
    dispatchReactUnityEvent("ClickedObjectTestButton", {
      stringValue: UTF8ToString(stringValue),
      intValue: intValue,
      boolValue: boolValue
    });
  }
});
