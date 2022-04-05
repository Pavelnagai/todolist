import {Dispatch} from 'redux';
import {todolistAPI} from "../../api/todolist-api";
import axios from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {fetchTaskTC} from "../tasks/tasks-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RequestStatusType, setAppStatus} from '../app/app-reducer';


const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: "todolist",
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.push({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeEntityStatusTodolistAC(state, action: PayloadAction<{ entityStatus: RequestStatusType, id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus

        },
        setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))

        },
        changeTodolistTitleAC(state, action: PayloadAction<{ todolistId: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.title
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ todolistId: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].filter = action.payload.filter
        },
        clearTodolist(state, action: PayloadAction) {
            state = []
        },

    }
})
export const todolistsReducer = slice.reducer

export const {
    addTodolistAC,
    removeTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    changeEntityStatusTodolistAC,
    setTodolistsAC,
    clearTodolist
} = slice.actions
//     (todolist: TodolistType) => ({
//     type: 'ADD-TODOLIST',
//     payload: {
//         todolist
//     }
// } as const)
// export const changeEntityStatusTodolistAC = (entityStatus: RequestStatusType, id: string) => ({
//     type: 'CHANGE-ENTITY-STATUS',
//     payload: {
//         entityStatus,
//         id
//     }
// } as const)
// export const setTodolistsAC = (todolists: Array<TodolistType>) => ({
//     type: 'SET-TODOLISTS',
//     payload: {todolists}
// } as const)
// export const changeTodolistTitleAC = (todolistId: string, title: string) => ({
//     type: 'CHANGE-TODOLIST-TITLE',
//     payload: {
//         title,
//         todolistId
//     }
// } as const)
// export const changeTodolistFilterAC = (todolistId: string, filter: FilterValuesType) => ({
//     type: 'CHANGE-TODOLIST-FILTER',
//     payload: {
//         filter,
//         todolistId
//     }
// } as const)

// export const clearTodolist = () => ({type: 'CLEAR-TODOLIST'} as const)

export const fetchTodolistsTC = () => async (dispatch: any) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.getTodolists()
        dispatch(setTodolistsAC({todolists: res.data}))
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
        dispatch(setAppStatus({status: 'idle'}))
    }
}


export const setTodolistTC = (title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === 0) {
            dispatch(addTodolistAC({todolist: res.data.data.item}))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(dispatch, err.message)
        }
    } finally {
        dispatch(setAppStatus({status: 'idle'}))
    }
}

export const removeTodolistTC = (todolistId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        dispatch(changeEntityStatusTodolistAC({entityStatus: 'loading', id: todolistId}))
        const res = await todolistAPI.removeTodolist(todolistId)
        if (res.data.resultCode === 0) {
            dispatch(removeTodolistAC({todolistId: todolistId}))
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(dispatch, err.message)
        }
    } finally {
        dispatch(dispatch(setAppStatus({status: 'idle'})))
    }
}

export const updateTodolist = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.updateTodolist(todolistId, title)
        if (res.data.resultCode === 0) {
            dispatch(changeTodolistTitleAC({todolistId, title}))
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(dispatch, err.message)
        }
    } finally {
        dispatch(dispatch(setAppStatus({status: 'idle'})))
    }
}

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