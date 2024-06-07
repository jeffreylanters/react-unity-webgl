using System.Runtime.InteropServices;
using UnityEngine.UI;
using UnityEngine;

class Controller : MonoBehaviour {
  [DllImport ("__Internal")] static extern void ClickedTestButton ();
  [DllImport ("__Internal")] static extern void ClickedStringTestButton (string value);
  [DllImport ("__Internal")] static extern void ClickedNumberTestButton (int value);
  [DllImport ("__Internal")] static extern void ClickedNumbersTestButton (int[] values, int length);
  [DllImport ("__Internal")] static extern void ClickedBoolTestButton (bool value);
  [DllImport ("__Internal")] static extern void ClickedObjectTestButton (string stringValue, int intValue, bool boolValue);
  [DllImport ("__Internal")] static extern string ClickedTestButtonReturnString ();

  public Text textLog;

  public void DispatchEvent () { 
#if !UNITY_EDITOR && UNITY_WEBGL
    ClickedTestButton(); 
#endif
  }

  public void DispatchStringEvent () { 
#if !UNITY_EDITOR && UNITY_WEBGL
    ClickedStringTestButton("Hello World!"); 
#endif
  }

  public void DispatchNumberEvent () { 
#if !UNITY_EDITOR && UNITY_WEBGL
    ClickedNumberTestButton(42); 
#endif
  }

  public void DispatchNumbersEvent () { 
#if !UNITY_EDITOR && UNITY_WEBGL
    var values = new int[] { 1, 2, 3, 4, 5 };
    ClickedNumbersTestButton(values, values.Length); 
#endif
  }

  public void DispatchBoolEvent () { 
#if !UNITY_EDITOR && UNITY_WEBGL
    ClickedBoolTestButton(true); 
#endif
  }

  public void DispatchObjectEvent () { 
#if !UNITY_EDITOR && UNITY_WEBGL
    ClickedObjectTestButton("Hello World!", 42, true); 
#endif
  }

    public void DispatchEventReturnString () { 
#if !UNITY_EDITOR && UNITY_WEBGL
    SetLogText(ClickedTestButtonReturnString()); 
#endif
  }

  void SetLogText (string text) {
    textLog.text = text;
  }
}
