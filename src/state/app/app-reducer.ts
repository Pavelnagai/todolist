import {Dispatch} from "redux"
import {AuthApi} from "../../api/todolist-api";
import {setIsLoggedInAC} from "../auth/auth-reducer";
import {handleServerNetworkError} from "../../utils/error-utils";
import axios from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setError: (state, action: PayloadAction<{ error: null | string }>) => {
            state.error = action.payload.error
        },
        setIsInitializedAC: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        },
    }
})

export const appReducer = slice.reducer
export const {setAppStatus, setError, setIsInitializedAC} = slice.actions


export const initializeAppTC = () => async (dispatch: Dispatch) => {
    try {
        const res = await AuthApi.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}));
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(dispatch, err.message)
        }
    } finally {
        dispatch(setIsInitializedAC({isInitialized: true}))
    }
}
