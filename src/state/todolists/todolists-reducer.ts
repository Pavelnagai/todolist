import {v1} from 'uuid';
import {Dispatch} from 'redux';
import {FilterValuesType, todolistAPI, TodolistDomainType, TodolistType} from "../../api/todolist-api";
import {AppActionsType, setAppStatus, SetAppStatusType, setError} from "../app/app-reducer";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;

type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | AppActionsType
const initialState: Array<TodolistDomainType> = []
export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id != action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all'}, ...state]
        case 'SET-TODOLISTS': {
            return action.todolists.map(tl => ({...tl, filter: 'all'}))
        }

        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state];
        }
        default:
            return state
    }
}

export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', id: todolistId} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
export const changeTodolistTitleAC = (todolistId: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    title: title,
    id: todolistId
} as const)
export const changeTodolistFilterAC = (todolistId: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    filter: filter,
    id: todolistId
} as const)


export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatus('loading'))
        todolistAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setAppStatus('succeeded'))
            })
    }
}

export const setTodolistTC = (title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatus('loading'))
        todolistAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(res.data.data.item))
                    dispatch(setAppStatus('succeeded'))
                } else {
                    dispatch(setError(res.data.messages[0]))
                    dispatch(setAppStatus('failed'))
                }

            })
    }
}

export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatus('loading'))
        todolistAPI.removeTodolist(todolistId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(setAppStatus('succeeded'))
                }
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
                    dispatch(setAppStatus('succeeded'))
                }
            })
    }
}
