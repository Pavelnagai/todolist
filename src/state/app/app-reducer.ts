import {Dispatch} from "redux"
import {AuthApi} from "../../api/todolist-api";
import {setIsLoggedInAC} from "../auth/auth-reducer";
import {handleServerNetworkError} from "../../utils/error-utils";
import axios from "axios";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.payload.status}
        case "APP/SET-ERROR":
            return {...state, error: action.payload.error}
        case "SET-IS-INITIALIZED":
            return {...state, isInitialized: action.payload.isInitialized}
        default:
            return state
    }
}

export const setAppStatus = (status: RequestStatusType) => ({
    type: 'APP/SET-STATUS',
    payload: {
        status
    }
} as const)

export const setError = (error: string | null) => ({
    type: 'APP/SET-ERROR',
    payload: {
        error
    }
} as const)

export const setIsInitializedAC = (isInitialized: boolean) => ({
    type: 'SET-IS-INITIALIZED',
    payload: {
        isInitialized
    }
} as const)

export const initializeAppTC = () => async (dispatch: Dispatch) => {
    try {
        const res = await AuthApi.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(dispatch, err.message)
        }
    } finally {
        dispatch(setIsInitializedAC(true))
    }
}

export type SetInitializedType = ReturnType<typeof setIsInitializedAC>
export type SetErrorType = ReturnType<typeof setError>
export  type SetAppStatusType = ReturnType<typeof setAppStatus>
export type AppActionsType = SetAppStatusType | SetErrorType | SetInitializedType