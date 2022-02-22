import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from '../todolists/todolists-reducer';
import {TaskType} from "../../components/TodolistList/Todolist/Todolist";
import {Dispatch} from "redux";
import {todolistAPI} from "../../api/todolist-api";


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
                ? {...t, isDone: action.isDone} : t)
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
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => ({type: 'REMOVE-TASK', todolistId, taskId} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string) => (
    {
        type: 'CHANGE-TASK-STATUS', isDone, todolistId, taskId
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
                dispatch(addTaskAC(res.data.data.item))
            })
    }
}

export const removeTaskThunkCreator = (todolistId: string, taskId: string) => {
    return (dispatch: Dispatch) => {
        todolistAPI.removeTask(todolistId, taskId)
            .then((res) => {
                dispatch(removeTaskAC(taskId, todolistId))
            })
    }
}

type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof setTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

