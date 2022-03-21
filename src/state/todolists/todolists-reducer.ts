import {Dispatch} from 'redux';
import {AppActionsType, RequestStatusType, setAppStatus} from "../app/app-reducer";
import {todolistAPI} from "../../api/todolist-api";
import axios from "axios";
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

export const fetchTodolistsTC = () => async (dispatch: any) => {
    try {
        dispatch(setAppStatus('loading'))
        const res = await todolistAPI.getTodolists()
        dispatch(setTodolistsAC(res.data))
        if (res.data) {
            res.data.forEach(el => {
                dispatch(fetchTaskTC(el.id))
            })
        }
    } catch
        (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(dispatch, e.message)
        }
    } finally {
        dispatch(dispatch(setAppStatus('idle')))
    }
}


export const setTodolistTC = (title: string) => async (dispatch: Dispatch<TodolistActionsType>) => {
    try {
        dispatch(setAppStatus('loading'))
        const res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === 0) {
            dispatch(addTodolistAC(res.data.data.item))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(dispatch, err.message)
        }
    } finally {
        dispatch(dispatch(setAppStatus('idle')))
    }
}

export const removeTodolistTC = (todolistId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus('loading'))
        dispatch(changeEntityStatusTodolistAC('loading', todolistId))
        const res = await todolistAPI.removeTodolist(todolistId)
        if (res.data.resultCode === 0) {
            dispatch(removeTodolistAC(todolistId))
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(dispatch, err.message)
        }
    } finally {
        dispatch(dispatch(setAppStatus('idle')))
    }
}

export const updateTodolist = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus('loading'))
        const res = await todolistAPI.updateTodolist(todolistId, title)
        if (res.data.resultCode === 0) {
            dispatch(changeTodolistTitleAC(todolistId, title))
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(dispatch, err.message)
        }
    } finally {
        dispatch(dispatch(setAppStatus('idle')))
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