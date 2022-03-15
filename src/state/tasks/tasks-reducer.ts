import {
    AddTodolistActionType, changeEntityStatusTodolistAC, ChangeEntityStatusTodolistType,
    RemoveTodolistActionType,
    SetTodolistsActionType,
    TodolistActionsType
} from '../todolists/todolists-reducer';
import {TaskType} from "../../components/TodolistList/Todolist/Todolist";
import {Dispatch} from "redux";
import {TaskPriorities, TaskStatuses, todolistAPI, UpdateTaskModelType} from "../../api/todolist-api";
import {AppRootStateType} from "../store/store";
import {setAppStatus, setError} from "../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


const initialState: TasksStateType = {}
export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            const stateCopy = {...state};
            const tasks = state[action.payload.todolistId];
            const filteredTasks = tasks.filter(t => t.id !== action.payload.taskId)
            stateCopy[action.payload.todolistId] = filteredTasks;
            return stateCopy;
        }
        case "ADD-TASK": {
            return {
                ...state,
                [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]]
            }
        }
        case 'CHANGE-TASK-STATUS': {
            state[action.payload.todolistId] = state[action.payload.todolistId].map(t => t.id === action.payload.taskId
                ? {...t, isDone: action.payload.status} : t)
            return {...state}
        }
        case 'CHANGE-TASK-TITLE': {
            state[action.payload.todolistId] = state[action.payload.todolistId].map(t => t.id === action.payload.taskId
                ? {...t, title: action.payload.title} : t)
            return {...state}
        }
        case 'ADD-TODOLIST': {
            return {...state, [action.payload.todolist.id]: []};
        }
        case "SET-TODOLISTS": {
            const stateCopy = {...state};
            action.payload.todolists.find(el => {
                stateCopy[el.id] = []
            })
            return stateCopy;
        }
        case 'REMOVE-TODOLIST': {
            const stateCopy = {...state};
            delete stateCopy[action.payload.todolistId]
            return stateCopy;
        }
        case "SET_TASK": {
            const stateCopy = {...state};
            stateCopy[action.payload.todolistID] = action.payload.task
            return stateCopy
        }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId]
                    .map(t => t.id === action.payload.taskId ? {...t, ...action.payload.model} : t)
            }
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => ({
    type: 'REMOVE-TASK',
    payload: {
        todolistId, taskId
    }
} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', payload: {task}} as const)
export const changeTaskStatusAC = (taskId: string, status: any, todolistId: string) => (
    {
        type: 'CHANGE-TASK-STATUS',
        payload: {
            status, todolistId, taskId
        }
    } as const)
export const setTaskAC = (todolistID: string, task: TaskType[]) => {
    return {
        type: 'SET_TASK',
        payload: {
            todolistID,
            task,
        }
    } as const
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => ({
    type: 'CHANGE-TASK-TITLE',
    payload: {
        title, todolistId, taskId
    }
} as const)

export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({
        type: 'UPDATE-TASK',
        payload: {
            model, todolistId, taskId
        }
    } as const)

export const fetchTaskTC = (todolistID: string) => (dispatch: Dispatch) => {

    dispatch(setAppStatus('loading'))
    todolistAPI.getTask(todolistID)
        .then((res) => {
            dispatch(setTaskAC(todolistID, res.data.items))
            dispatch(setAppStatus('succeeded'))
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        })
        .finally(() => {
            dispatch(dispatch(setAppStatus('idle')))
        })
}


export const addTaskThunkCreator = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatus('loading'))
        todolistAPI.setTask(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTaskAC(res.data.data.item))
                    dispatch(setAppStatus('succeeded'))
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

export const removeTaskThunkCreator = (todolistId: string, taskId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatus('loading'))
        todolistAPI.removeTask(todolistId, taskId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTaskAC(taskId, todolistId))
                    dispatch(setAppStatus('succeeded'))
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

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasksReducer[todolistId].find(t => t.id === taskId)
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
            ...domainModel
        }
        dispatch(setAppStatus('loading'))
        todolistAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC(taskId, domainModel, todolistId))
                    dispatch(setAppStatus('succeeded'))
                }
            })
            .catch(() => {

            })
            .finally(() => {
                dispatch(setAppStatus('idle'))
            })
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof setTaskAC>
    | UpdateTaskType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | TodolistActionsType
    | ChangeEntityStatusTodolistType

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type UpdateTaskType = ReturnType<typeof updateTaskAC>