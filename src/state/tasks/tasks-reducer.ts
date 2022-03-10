import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from '../todolists/todolists-reducer';
import {TaskType} from "../../components/TodolistList/Todolist/Todolist";
import {Dispatch} from "redux";
import {TaskPriorities, TaskStatuses, todolistAPI, UpdateTaskModelType} from "../../api/todolist-api";
import {AppRootStateType} from "../store/store";


const initialState: TasksStateType = {}
export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {

            const stateCopy = {...state};
            const tasks = state[action.todolistId];
            const filteredTasks = tasks.filter(t => t.id !== action.taskId)
            stateCopy[action.todolistId] = filteredTasks;
            return stateCopy;
        }
        case "ADD-TASK": {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }
        case 'CHANGE-TASK-STATUS': {
            state[action.todolistId] = state[action.todolistId].map(t => t.id === action.taskId
                ? {...t, isDone: action.status} : t)
            return {...state}
        }
        case 'CHANGE-TASK-TITLE': {
            state[action.todolistId] = state[action.todolistId].map(t => t.id === action.taskId
                ? {...t, title: action.title} : t)
            return {...state}
        }
        case 'ADD-TODOLIST': {
            return {...state, [action.todolist.id]: []};
        }
        case "SET-TODOLISTS": {
            const stateCopy = {...state};
            action.todolists.find(el => {
                stateCopy[el.id] = []
            })
            return stateCopy;
        }
        case 'REMOVE-TODOLIST': {
            const stateCopy = {...state};
            delete stateCopy[action.id]
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
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => ({type: 'REMOVE-TASK', todolistId, taskId} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const changeTaskStatusAC = (taskId: string, status: any, todolistId: string) => (
    {
        type: 'CHANGE-TASK-STATUS', status, todolistId, taskId
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
    type: 'CHANGE-TASK-TITLE', title, todolistId, taskId
} as const)

export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)

export const fetchTaskTC = (todolistID: string) => (dispatch: Dispatch) => {
    todolistAPI.getTask(todolistID)
        .then((res) => {
            dispatch(setTaskAC(todolistID, res.data.items))
        })
}


export const addTaskThunkCreator = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        todolistAPI.setTask(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTaskAC(res.data.data.item))
                }
            })
    }
}

export const removeTaskThunkCreator = (todolistId: string, taskId: string) => {
    return (dispatch: Dispatch) => {
        todolistAPI.removeTask(todolistId, taskId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTaskAC(taskId, todolistId))
                }
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

        todolistAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC(taskId, domainModel, todolistId))
                }
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

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type UpdateTaskType = ReturnType<typeof updateTaskAC>