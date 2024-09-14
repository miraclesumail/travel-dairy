/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-11 16:13:23
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-07-15 16:19:31
 * @FilePath: /nextjs/travel-dairy/src/store/reducers/counter.slice.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 */
import { createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../";

interface CounterState {
  value: number;
  name: string;
}

// Define the initial state using that type
const initialState: CounterState = {
  value: 88,
  name: "",
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state: any) => {
      console.log('REHYDRATE', state)
      if (state.user) {
        state.isLoggedIn = true
      }
    })
  }
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export const incrementAsync = (amount: number) => (dispatch: AppDispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount));
  }, 1000);
};

export default counterSlice.reducer;
