using System.Runtime.InteropServices;
using UnityEngine;
using UnityEngine.UI;

public class MessageButtonController : MonoBehaviour {

  public string message;

  [DllImport ("__Internal")]
  private static extern void Say (string message);

  private void Awake () {
    this.GetComponent<Button> ().onClick.AddListener (() => {
      Say (this.message);
    });
  }
}