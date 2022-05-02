using System.Runtime.InteropServices;
using UnityEngine;

public class CanvasController : MonoBehaviour {

  [DllImport ("__Internal")]
  private static extern void ClickedPosition (float x, float y);

  private void Update () {
    if (Input.GetMouseButtonDown (0) == true) {
      ClickedPosition (Input.mousePosition.x, Input.mousePosition.y);
    }
  }
}
