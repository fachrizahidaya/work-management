import { useCallback, useState } from "react";

export const useLoading = (initial = false) => {
  const [isLoading, setIsLoading] = useState(initial);

  const start = useCallback(() => setIsLoading(true), []);
  const stop = useCallback(() => setIsLoading(false), []);
  const toggle = useCallback(() => setIsLoading((state) => !state), []);

  return { isLoading, start, stop, toggle };
};
