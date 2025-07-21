/**
 * Sending messages to Unity can be done with various types of parameters.
 * This type declaration allows for flexibility in the types of parameters that
 * can be sent. It can be a string, number, undefined, or void. This is useful
 * for sending different types of data to Unity methods.
 */
type UnityMessageParameter = string | number | undefined | void;

export type { UnityMessageParameter };
