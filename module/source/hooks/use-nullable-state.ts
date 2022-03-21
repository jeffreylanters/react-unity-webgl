import { Dispatch, SetStateAction, useState } from "react";

/**
 * A hook that creates a nullable state.
 * @param initialState Optional initial state, defaults to null.
 * @returns a stateful value, and a function to update it.
 */
const useNullableState = <Type>(
  initialState?: Type | null | (() => Type | null)
): [Type | null, Dispatch<SetStateAction<Type | null>>] => {
  return useState<Type | null>(initialState || null);
};

export { useNullableState };
