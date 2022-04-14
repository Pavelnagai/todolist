import {addTodolistTC, fetchTodolistsTC, removeTodolistTC} from '../todolists/todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolist-api";
import {RequestStatusType, setAppStatus} from "../app/app-reducer";
import axios from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppRootStateType} from "../store/store";


export const fetchTaskTC = createAsyncThunk('task-fetch', async (param: { todolistID: string }, thunkAPI) => {
    try {
        const todolistID = param.todolistID
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.getTask(todolistID);
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
        return {todolistID, task: res.data.items}
    } catch (err: any) {
        handleServerNetworkError(thunkAPI.dispatch, err.message)
        return thunkAPI.rejectWithValue(null)
    }
})
export const addTaskThunkCreator = createAsyncThunk('tasks-addTask', async (param: { todolistId: string, title: string }, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.setTask(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {task: res.data.data.item}
        } else {
            handleServerAppError(thunkAPI.dispatch, res.data)
            return thunkAPI.rejectWithValue(null)
        }
    } catch (e: any) {
        handleServerNetworkError(thunkAPI.dispatch, e.message)
        return thunkAPI.rejectWithValue(null)
    }
})
export const removeTaskThunkCreator = createAsyncThunk('task-remove', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.removeTask(param.todolistId, param.taskId)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {taskId: param.taskId, todolistId: param.todolistId}
        }
        return thunkAPI.rejectWithValue(null)
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(thunkAPI.dispatch, e.message)
            return thunkAPI.rejectWithValue(null)
        }
        return thunkAPI.rejectWithValue(null)
    }
})
export const updateTaskTC = createAsyncThunk('task-update', async (param: { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }, thunkAPI) => {
    const state = thunkAPI.getState() as AppRootStateType
    const task = state.tasksReducer[param.todolistId].find((t: { id: string; }) => t.id === param.taskId)
    if (!task) {
        return thunkAPI.rejectWithValue('task not found in the state')
    }
    const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...param.domainModel
    }
    try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.updateTask(param.todolistId, param.taskId, apiModel)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {
                taskId: param.taskId,
                model: param.domainModel,
                todolistId: param.todolistId
            }
        }
        return thunkAPI.rejectWithValue(null)
    } catch (e: any) {
        handleServerNetworkError(thunkAPI.dispatch, e.message)
        return thunkAPI.rejectWithValue(null)
    }
})

const slice = createSlice({
    name: "task",
    initialState: {} as TasksStateType,
    reducers: {
        changeTaskStatusAC: (state, action: PayloadAction<{ taskId: string, status: RequestStatusType, todolistId: string }>) => {
            state[action.payload.todolistId].map(t => t.id === action.payload.taskId
                ? {...t, isDone: action.payload.status} : t)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            action.payload.todolists.find((el: any) => {
                state[el.id] = []
            })
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            delete state[action.payload.todolistId]
        })
        builder.addCase(addTaskThunkCreator.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].push(action.payload.task)
        })
        builder.addCase(removeTaskThunkCreator.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(el => el.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        })
        builder.addCase(fetchTaskTC.fulfilled, (state, action) => {
            state[action.payload.todolistID] = action.payload.task
        })
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(el => el.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        })
    }
})

export const tasksReducer = slice.reducer

export const {changeTaskStatusAC} = slice.actions

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}
