import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./token";
import trackDataReducer from "./trackData";
export default configureStore({
  reducer: { token: tokenReducer, trackData: trackDataReducer },
});
