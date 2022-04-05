import {setError} from "../state/app/app-reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolist-api";

export const handleServerNetworkError = (dispatch: Dispatch, message: string) => {
    dispatch(setError({error: message}))
}

export const handleServerAppError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(setError({error: data.messages[0]}))
    } else {
        dispatch(setError({error: 'Some error occurred'}))
    }
    dispatch(setError({error: 'failed'}))
}

