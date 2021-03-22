export default interface IUnityEvent {
  /**
   * The events name. It will be triggered by the name.
   * @public
   * @type {string}
   */
  eventName: string;

  /**
   * The events callback. This event will be triggered when the event is dispatched.
   * @public
   * @type {Function}
   */
  eventCallback: Function;
}
