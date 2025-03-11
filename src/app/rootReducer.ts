import { combineReducers } from "@reduxjs/toolkit";
import * as auth from '../features/redux/reduxGrid/reducer'

export const rootReducer = combineReducers({
    auth: auth.fashionReducer
})