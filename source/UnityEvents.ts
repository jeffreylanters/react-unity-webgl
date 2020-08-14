export default class UnityEvents {
  /**
   * Mapping event name to list of callbacks
   * @type {Map<string, Function[]>}
   * @private
   */
  private map: Map<string, Function[]>;

  constructor() {
    this.map = new Map<string, Function[]>();
  }

  /**
   * Adds a callback for eventName
   * @param eventName the event name.
   * @param callback false the public method name.
   */
  public AddEventListener(
    eventName: string,
    callback: Function
  ): void {
    if (!this.map.has(eventName)) {
      this.map.set(eventName, []);
    }
    this.map.get(eventName)!.push(callback);
  }

  /**
   * Dispatch eventName to all registered callbacks
   * @param eventName the event name
   * @param parameter the event parameter
   */
  public DispatchEvent(
    eventName: string,
    parameter: any
  ): void {
    if (!this.map.has(eventName)) return;

    // the first callack that returns true aborts dispatch
    this.map.get(eventName)!.find(callback => {
      try {
        return callback(parameter);
      } catch (e) {
        // ignore errors and keep on dispatching the event
        return;
      }
    });
  }
}
