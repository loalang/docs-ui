import { useState, useEffect } from "react";

export function usePromise<T>(
  getPromise: () => Promise<T>
): {
  isLoading: boolean;
  error: Error | null;
  result: T | null;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(null as T | null);
  const [error, setError] = useState(null as Error | null);

  useEffect(() => {
    setError(null);
    setIsLoading(true);

    let isCurrent = true;
    function ifCurrent<A, R>(f: (arg: A) => R): (arg: A) => R | null {
      return (arg: A) => {
        if (isCurrent) {
          return f(arg);
        }
        return null;
      };
    }
    getPromise()
      .then(ifCurrent(setResult))
      .catch(ifCurrent(setError))
      .finally(() => ifCurrent(setIsLoading)(false));
    return () => {
      isCurrent = false;
    };
  }, [getPromise]);

  return { result, isLoading, error };
}
