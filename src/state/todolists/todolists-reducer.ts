import {Dispatch} from 'redux';
import {AppActionsType, RequestStatusType, setAppStatus, setError} from "../app/app-reducer";
import {todolistAPI} from "../../api/todolist-api";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {fetchTaskTC} from "../tasks/tasks-reducer";


const initialState: Array<TodolistDomainType> = []
export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.payload.todolistId)
        case 'ADD-TODOLIST':
            return [{...action.payload.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'SET-TODOLISTS': {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.payload.todolistId);
            if (todolist) {
                todolist.title = action.payload.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.payload.todolistId);
            if (todolist) {
                todolist.filter = action.payload.filter;
            }
            return [...state];
        }
        case "CHANGE-ENTITY-STATUS":
            return state.map(tl => tl.id === action.payload.id ? {
                ...tl,
                entityStatus: action.payload.entityStatus
            } : tl)
        case "CLEAR-TODOLIST":
            return []
        default:
            return state
    }
}

export const removeTodolistAC = (todolistId: string) => ({
    type: 'REMOVE-TODOLIST', payload: {todolistId}
} as const)
export const addTodolistAC = (todolist: TodolistType) => ({
    type: 'ADD-TODOLIST',
    payload: {
        todolist
    }
} as const)
export const changeEntityStatusTodolistAC = (entityStatus: RequestStatusType, id: string) => ({
    type: 'CHANGE-ENTITY-STATUS',
    payload: {
        entityStatus,
        id
    }
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({
    type: 'SET-TODOLISTS',
    payload: {todolists}
} as const)
export const changeTodolistTitleAC = (todolistId: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    payload: {
        title,
        todolistId
    }
} as const)
export const changeTodolistFilterAC = (todolistId: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    payload: {
        filter,
        todolistId
    }
} as const)

export const clearTodolist = () => ({type: 'CLEAR-TODOLIST'} as const)

export const fetchTodolistsTC = () => {
    return (dispatch: any) => {
        dispatch(setAppStatus('loading'))
        todolistAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                return res.data
            })
            .then((todos) => {
                todos.forEach(el => {
                    dispatch(fetchTaskTC(el.id))
                })
            })
            .catch((err: AxiosError) => {
                dispatch(setError(err.message))
            })
            .finally(() => {
                dispatch(dispatch(setAppStatus('idle')))
            })
    }
}

export const setTodolistTC = (title: string) => {

    return (dispatch: Dispatch<TodolistActionsType>) => {
        dispatch(setAppStatus('loading'))
        todolistAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(res.data.data.item))
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
}

export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatus('loading'))
        dispatch(changeEntityStatusTodolistAC('loading', todolistId))
        todolistAPI.removeTodolist(todolistId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todolistId))
                }
            })
            .catch((err: AxiosError) => {
                handleServerNetworkError(dispatch, err.message)
            })
            .finally(() => {
                dispatch(dispatch(setAppStatus('idle')))
            })
    }
}

export const updateTodolist = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatus('loading'))
        todolistAPI.updateTodolist(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTodolistTitleAC(todolistId, title))
                }
            })
            .catch((err: AxiosError) => {
                handleServerNetworkError(dispatch, err.message)
            })
            .finally(() => {
                dispatch(dispatch(setAppStatus('idle')))
            })
    }
}

export type TodolistActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | AppActionsType
    | ChangeEntityStatusTodolistType
    | ClearTodolistType

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type ChangeEntityStatusTodolistType = ReturnType<typeof changeEntityStatusTodolistAC>
export type ClearTodolistType = ReturnType<typeof clearTodolist>

export type TodolistType = {
    addedDate: string
    id: string
    order: number
    title: string
}

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}