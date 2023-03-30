import { useEffect, useReducer, useRef } from "react";
// State & hook output
interface State<T> {
  status: "init" | "fetching" | "error" | "fetched";
  data?: T;
  error?: string;
}

// discriminated union type
type Action<T> =
  | { type: "request" }
  | { type: "success"; payload: T }
  | { type: "failure"; payload: string };

function useFetch<T = unknown>(serviceCall: () => Promise<T>): State<T> {
  const cancelRequest = useRef<boolean>(false);
  const initialState: State<T> = {
    status: "init",
    error: undefined,
    data: undefined,
  };
  // Keep state logic separated
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "request":
        return { ...initialState, status: "fetching" };
      case "success":
        return {
          ...initialState,
          status: "fetched",
          data: action.payload,
        };
      case "failure":
        return {
          ...initialState,
          status: "error",
          error: action.payload,
        };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    if (!serviceCall) {
      return;
    }
    const fetchData = async () => {
      dispatch({ type: "request" });

      try {
        const response = await serviceCall();
        if (cancelRequest.current) return;
        dispatch({ type: "success", payload: response });
      } catch (error) {
        if (cancelRequest.current) return;
        dispatch({ type: "failure", payload: "error" });
      }
    };
    fetchData();
  }, []);
  return state;
}
export default useFetch;
