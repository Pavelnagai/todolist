import {Dispatch} from 'redux'
import {setAppStatus} from "../app/app-reducer";
import {AuthApi, LoginParamsType} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios from "axios";
import {clearTodolist} from "../todolists/todolists-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
            setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
                state.isLoggedIn = action.payload.value
            }
        }
    }
)

export const authReducer = slice.reducer

export const {setIsLoggedInAC} = slice.actions


export const loginTC = (data: LoginParamsType) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus({status:'loading'}))
        const res = await AuthApi.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(dispatch, err.message)
        }
    } finally {
        dispatch(dispatch(setAppStatus({status: 'idle'})))
    }
}

export const logoutTC = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus({status:'loading'}))
        const res = await AuthApi.logout()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: false}))
            dispatch(setAppStatus({status:'succeeded'}))
            dispatch(clearTodolist())
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(dispatch, err.message)
        }
    } finally {
        dispatch(dispatch(setAppStatus({status: 'idle'})))
    }
}

