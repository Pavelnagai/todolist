import {Dispatch} from 'redux'
import {AppActionsType, setAppStatus} from "../app/app-reducer";
import {AuthApi, LoginParamsType} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {clearTodolist, ClearTodolistType} from "../todolists/todolists-reducer";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus('loading'))
    AuthApi.login(data)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        })
        .finally(() => {
            dispatch(dispatch(setAppStatus('idle')))
        })
}

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus('loading'))
    AuthApi.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatus('succeeded'))
                dispatch(clearTodolist())
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error.message)
        })
}


type ActionsType = ReturnType<typeof setIsLoggedInAC> | AppActionsType | ClearTodolistType
