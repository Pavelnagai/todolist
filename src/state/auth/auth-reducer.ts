import {setAppStatus} from "../app/app-reducer";
import {AuthApi, LoginParamsType} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {clearTodolist} from "../todolists/todolists-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const loginTC = createAsyncThunk('auth/login', async (data: LoginParamsType, thunkApi) => {
    try {
        thunkApi.dispatch(setAppStatus({status: 'loading'}))
        debugger
        const res = await AuthApi.login(data)
        if (res.data.resultCode === 0) {
            thunkApi.dispatch(setAppStatus({status: 'succeeded'}))
            return
        } else {
            handleServerAppError(thunkApi.dispatch, res.data)
            return thunkApi.rejectWithValue(null)
        }
    } catch (err: any) {
        handleServerNetworkError(thunkApi.dispatch, err.message)
        return thunkApi.rejectWithValue(null)
    }
})
export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkApi) => {
    try {
        thunkApi.dispatch(setAppStatus({status: 'loading'}))
        const res = await AuthApi.logout()
        if (res.data.resultCode === 0) {
            thunkApi.dispatch(setAppStatus({status: 'succeeded'}))
            thunkApi.dispatch(clearTodolist())
            return
        } else {
            handleServerAppError(thunkApi.dispatch, res.data)
        }
    } catch (err: any) {
        handleServerNetworkError(thunkApi.dispatch, err.message)
    }
})


const slice = createSlice({
        name: 'auth',
        initialState: {
            isLoggedIn: false
        },
        reducers: {
            setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
                state.isLoggedIn = action.payload.value
            }
        },
        extraReducers: builder => {
            builder.addCase(loginTC.fulfilled, (state, action) => {
                state.isLoggedIn = true;
            })
            builder.addCase(logoutTC.fulfilled, (state, action) => {
                state.isLoggedIn = false;
            })
        },
    }
)

export const authReducer = slice.reducer

export const {setIsLoggedInAC} = slice.actions

