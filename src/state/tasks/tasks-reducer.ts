import {addTodolistAC, removeTodolistAC, setTodolistsAC} from '../todolists/todolists-reducer';
import {Dispatch} from "redux";
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolist-api";
import {RequestStatusType, setAppStatus} from "../app/app-reducer";
import axios from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: TasksStateType = {}

export const fetchTaskTC = createAsyncThunk('task-fetch', async (param: { todolistID: string }, thunkAPI) => {
    try {
        debugger
        const todolistID = param.todolistID
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.getTask(todolistID);
        thunkAPI.dispatch(setTaskAC({todolistID, task: res.data.items}))
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(thunkAPI.dispatch, err.message)
        }
    } finally {
        thunkAPI.dispatch(setAppStatus({status: 'idle'}))
    }
})

// export const fetchTaskTC_ = (todolistID: string) => async (dispatch: Dispatch) => {
//     try {
//         dispatch(setAppStatus({status: 'loading'}))
//         const res = await todolistAPI.getTask(todolistID)
//         dispatch(setTaskAC({todolistID, task: res.data.items}))
//         dispatch(setAppStatus({status: 'succeeded'}))
//     } catch (err) {
//         if (axios.isAxiosError(err)) {
//             handleServerNetworkError(dispatch, err.message)
//         }
//     } finally {
//         dispatch(dispatch(setAppStatus({status: 'idle'})))
//     }
// }

export const addTaskThunkCreator = createAsyncThunk('tasks-addTask', async (param: { todolistId: string, title: string }, thunkAPI) => {
    debugger
    try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.setTask(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(addTaskAC({task: res.data.data.item}))
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(thunkAPI.dispatch, res.data)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(thunkAPI.dispatch, e.message)
        }
    } finally {
        thunkAPI.dispatch(setAppStatus({status: 'idle'}))
    }
})
export const addTaskThunkCreator_ = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.setTask(todolistId, title)
        if (res.data.resultCode === 0) {
            dispatch(addTaskAC({task: res.data.data.item}))
            dispatch(setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(dispatch, e.message)
        }
    } finally {
        dispatch(dispatch(setAppStatus({status: 'idle'})))
    }
}
export const removeTaskThunkCreator = createAsyncThunk('task-remove', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.removeTask(param.todolistId, param.taskId)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(removeTaskAC({taskId: param.taskId, todolistId: param.todolistId}))
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(thunkAPI.dispatch, e.message)
        }
    } finally {
        thunkAPI.dispatch(setAppStatus({status: 'idle'}))
    }
})
export const removeTaskThunkCreator_ = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.removeTask(todolistId, taskId)
        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC({taskId, todolistId}))
            dispatch(setAppStatus({status: 'succeeded'}))
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(dispatch, e.message)
        }
    } finally {
        dispatch(dispatch(setAppStatus({status: 'idle'})))
    }
}
export const updateTaskTC = createAsyncThunk('task-update', async (param: { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }, thunkAPI) => {
    const state: any = thunkAPI.getState()
    const task = state.tasksReducer[param.todolistId].find((t: { id: string; }) => t.id === param.taskId)
    if (!task) {
        console.warn('task not found in the state')
        return
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
            thunkAPI.dispatch(updateTaskAC({
                taskId: param.taskId,
                model: param.domainModel,
                todolistId: param.todolistId
            }))
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(thunkAPI.dispatch, e.message)
        }
    } finally {
        thunkAPI.dispatch(setAppStatus({status: 'idle'}))
    }
})
// export const updateTaskTC_ = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
//     async (dispatch: Dispatch, getState: () => AppRootStateType) => {
//         const state = getState()
//         const task = state.tasksReducer[todolistId].find(t => t.id === taskId)
//         if (!task) {
//             console.warn('task not found in the state')
//             return
//         }
//         const apiModel: UpdateTaskModelType = {
//             deadline: task.deadline,
//             description: task.description,
//             priority: task.priority,
//             startDate: task.startDate,
//             title: task.title,
//             status: task.status,
//             ...domainModel
//         }
//         try {
//             dispatch(setAppStatus({status: 'loading'}))
//             const res = await todolistAPI.updateTask(todolistId, taskId, apiModel)
//             if (res.data.resultCode === 0) {
//                 dispatch(updateTaskAC({taskId, model: domainModel, todolistId}))
//                 dispatch(setAppStatus({status: 'succeeded'}))
//             }
//         } catch (e) {
//             if (axios.isAxiosError(e)) {
//                 handleServerNetworkError(dispatch, e.message)
//             }
//         } finally {
//             dispatch(dispatch(setAppStatus({status: 'idle'})))
//         }
//     }


const slice = createSlice({
    name: "task",
    initialState: <TasksStateType>{},
    reducers: {
        removeTaskAC: (state, action: PayloadAction<{ taskId: string, todolistId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(el => el.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        },
        addTaskAC: (state, action: PayloadAction<{ task: TaskType }>) => {
            state[action.payload.task.todoListId].push(action.payload.task)
        },
        changeTaskStatusAC: (state, action: PayloadAction<{ taskId: string, status: RequestStatusType, todolistId: string }>) => {
            state[action.payload.todolistId].map(t => t.id === action.payload.taskId
                ? {...t, isDone: action.payload.status} : t)
        },
        setTaskAC: (state, action: PayloadAction<{ todolistID: string, task: TaskType[] }>) => {
            state[action.payload.todolistID] = action.payload.task
        },
        updateTaskAC: (state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(el => el.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },

    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.find((el: any) => {
                state[el.id] = []
            })
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistId]
        })
    }
})
export const tasksReducer = slice.reducer

export const {removeTaskAC, addTaskAC, changeTaskStatusAC, setTaskAC, updateTaskAC} = slice.actions

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
