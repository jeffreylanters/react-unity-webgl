using System.Runtime.InteropServices;
using UnityEngine;

public class CrateController : MonoBehaviour {

  private float rotationSpeed = 30;
  private bool isRotating = true;

  [DllImport ("__Internal")]
  private static extern void RotationDidUpdate (float degrees);

  private void Update () {
    if (this.isRotating == true) {
      this.transform.Rotate (new Vector3 (0, this.rotationSpeed * Time.deltaTime));
      RotationDidUpdate (this.transform.localEulerAngles.y);
    }
  }

  public void SetRotationSpeed (float rotationSpeed) {
    this.rotationSpeed = rotationSpeed;
  }

  public void StopRotation () {
    this.isRotating = false;
  }

  public void StartRotation () {
    this.isRotating = true;
  }
}