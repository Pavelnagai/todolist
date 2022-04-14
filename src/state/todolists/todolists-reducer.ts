import {todolistAPI} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {fetchTaskTC} from "../tasks/tasks-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RequestStatusType, setAppStatus} from '../app/app-reducer';


export const fetchTodolistsTC = createAsyncThunk("todolist-fetchTodolists", async (param, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.getTodolists()
        if (res.data) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            res.data.forEach(el => {
                thunkAPI.dispatch(fetchTaskTC({todolistID: el.id}))
            })
        }
        return {todolists: res.data}
    } catch
        (e: any) {
        handleServerNetworkError(thunkAPI.dispatch, e.message)
        return thunkAPI.rejectWithValue(null)
    }
})

export const addTodolistTC = createAsyncThunk("todolist-setTodolist", async (param: { title: string }, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.createTodolist(param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {todolist: res.data.data.item}
        } else {
            handleServerAppError(thunkAPI.dispatch, res.data)
            return thunkAPI.rejectWithValue(null)
        }
    } catch (err: any) {
        handleServerNetworkError(thunkAPI.dispatch, err.message)
        return thunkAPI.rejectWithValue(null)
    }
})

export const removeTodolistTC = createAsyncThunk("todolist-removeTodo", async (todolistId: string, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        thunkAPI.dispatch(changeEntityStatusTodolistAC({entityStatus: 'loading', id: todolistId}))
        const res = await todolistAPI.removeTodolist(todolistId)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {todolistId: todolistId}
        }
        return thunkAPI.rejectWithValue(null)
    } catch (err: any) {
        handleServerNetworkError(thunkAPI.dispatch, err.message)
        return thunkAPI.rejectWithValue(null)
    }
})

export const updateTodolist = createAsyncThunk('todolist-update', async (param: { todolistId: string, title: string }, thunkAPI) => {
    try {
        const todolistId = param.todolistId;
        const title = param.title
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.updateTodolist(todolistId, title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {todolistId, title}
        }
        return thunkAPI.rejectWithValue(null)
    } catch (err: any) {
        handleServerNetworkError(thunkAPI.dispatch, err.message)
        return thunkAPI.rejectWithValue(null)
    }
})

const slice = createSlice({
    name: "todolist",
    initialState: [] as TodolistDomainType[],
    reducers: {
        changeEntityStatusTodolistAC(state, action: PayloadAction<{ entityStatus: RequestStatusType, id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus

        },
        changeTodolistFilterAC(state, action: PayloadAction<{ todolistId: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].filter = action.payload.filter
        },
        clearTodolist(state, action: PayloadAction) {
            state = []
        },

    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))

        })
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.push({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
        })
        builder.addCase(updateTodolist.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.title
        })
    }
})
export const todolistsReducer = slice.reducer

export const {
    changeTodolistFilterAC,
    changeEntityStatusTodolistAC,
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