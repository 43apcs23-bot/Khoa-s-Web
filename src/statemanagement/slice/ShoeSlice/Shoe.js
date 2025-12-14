import { createSlice } from "@reduxjs/toolkit";
import { initialState, getAllShoe, getShoeById, getShoeByIdOnPageLoad, getTopShoe } from "./index";

const shoeSlice = createSlice({
    name: "Shoe",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllShoe.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllShoe.fulfilled, (state, action) => {
                state.loading = false;
                state.shoeData = action.payload.data;
                state.runningData = action.payload.runnning;
                state.loungingData = action.payload.lounging;
                state.everydayData = action.payload.everyday;
            })
            .addCase(getAllShoe.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
            })
            .addCase(getTopShoe.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTopShoe.fulfilled, (state, action) => {
                state.loading = false;
                state.topShoeData = action.payload;
            })
            .addCase(getTopShoe.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
            })
            .addCase(getShoeByIdOnPageLoad.pending, (state) => {
                state.loading = true;
            })
            .addCase(getShoeByIdOnPageLoad.fulfilled, (state, action) => {
                state.loading = false;
                state.singleShoeData = action.payload;
            })
            .addCase(getShoeByIdOnPageLoad.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getShoeById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getShoeById.fulfilled, (state, action) => {
                state.loading = false;
                state.singleShoeData = state.shoeData.filter((item) => item._id === action.payload)[0];
            })
            .addCase(getShoeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const shoeReducer = shoeSlice.reducer;

