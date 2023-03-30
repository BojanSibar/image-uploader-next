import { Dispatch, ReducerState, useReducer } from "react";

export type Statuses = "init" | "fetching" | "error" | "fetched";

interface State<T extends { name: string; path: string }> {
  initLoadStatus: Statuses;
  addLoadStatus: Statuses;
  initImages: string[];
  images: string[];
  imagesData: Record<string, T>;
}

type Action<T> =
  | { type: "addInitImages"; payload: T[] }
  | { type: "addNewImage"; payload: T }
  | { type: "searchImage"; payload: { data: T[]; term: string } }
  | { type: "deleteImage"; payload: string };

const initialState = {
  initLoadStatus: "init" as Statuses,
  addLoadStatus: "init" as Statuses,
  initImages: [],
  images: [],
  imagesData: {},
};

//removes key from object
function removeByKey<T>(myObj: Record<string, T>, deleteKey: string) {
  return Object.keys(myObj)
    .filter((key) => key !== deleteKey)
    .reduce((result, current) => {
      result[current] = myObj[current];
      return result;
    }, {} as Record<string, T>);
}

function useImageData<T extends { name: string; path: string } = any>(): [
  State<T>,
  Dispatch<Action<T>>
] {
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "addInitImages":
        return {
          ...initialState,
          initImages: action.payload.map((item) => item.path),
          images: action.payload.map((item) => item.path),
          imagesData: action.payload.reduce(
            (acc, item) => ({
              ...acc,
              [item.path]: { ...item },
            }),
            {}
          ),
        };
      case "addNewImage":
        return {
          ...state,
          images: [...state.images, action.payload.path],
          imagesData: {
            ...state.imagesData,
            [action.payload.path]: { ...action.payload },
          },
        };
      case "searchImage":
        return {
          ...state,
          images: !!action.payload.term
            ? action.payload.data.map((item) => item.path)
            : [...state.initImages],
        };
      case "deleteImage":
        return {
          ...state,
          images: state.images.filter((item) => item != action.payload),
          imagesData: removeByKey(state.imagesData, action.payload),
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);
  return [state, dispatch];
}

export default useImageData;
