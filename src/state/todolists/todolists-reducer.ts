import {todolistAPI} from "../../api/todolist-api";
import axios from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {fetchTaskTC} from "../tasks/tasks-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RequestStatusType, setAppStatus} from '../app/app-reducer';


const initialState: Array<TodolistDomainType> = []

export const fetchTodolistsTC = createAsyncThunk("todolist-fetchTodolists",
    async (param, thunkAPI) => {
        try {
            thunkAPI.dispatch(setAppStatus({status: 'loading'}))
            const res = await todolistAPI.getTodolists()
            thunkAPI.dispatch(setTodolistsAC({todolists: res.data}))
            if (res.data) {
                res.data.forEach(el => {
                    thunkAPI.dispatch(fetchTaskTC({todolistID: el.id}))
                })
            }
        } catch
            (e) {
            if (axios.isAxiosError(e)) {
                handleServerNetworkError(thunkAPI.dispatch, e.message)
            }
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }
    })

export const setTodolistTC = createAsyncThunk("todolist-setTodolist", async (param: { title: string }, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.createTodolist(param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(addTodolistAC({todolist: res.data.data.item}))
        } else {
            handleServerAppError(thunkAPI.dispatch, res.data)
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(thunkAPI.dispatch, err.message)
        }
    } finally {
        thunkAPI.dispatch(setAppStatus({status: 'idle'}))
    }
})

export const removeTodolistTC = createAsyncThunk("todolist-removeTodo", async (todolistId: string, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        thunkAPI.dispatch(changeEntityStatusTodolistAC({entityStatus: 'loading', id: todolistId}))
        const res = await todolistAPI.removeTodolist(todolistId)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(removeTodolistAC({todolistId: todolistId}))
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(thunkAPI.dispatch, err.message)
        }
    } finally {
        thunkAPI.dispatch(setAppStatus({status: 'idle'}))
    }
})

export const updateTodolist = createAsyncThunk('todolist-update', async (param: { todolistId: string, title: string }, thunkAPI) => {
    try {
        const todolistId = param.todolistId;
        const title = param.title
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.updateTodolist(todolistId, title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(changeTodolistTitleAC({todolistId, title}))
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(thunkAPI.dispatch, err.message)
        }
    } finally {
        thunkAPI.dispatch(setAppStatus({status: 'idle'}))
    }
})

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