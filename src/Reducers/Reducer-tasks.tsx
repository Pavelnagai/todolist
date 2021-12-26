import React from 'react';
import {TasksStateType} from "../App";
import {v1} from "uuid";

export type tsarReducerTask =
    updateTaskACType
    | addTaskACType
    | removeTaskACTYpe
    | changeStatusACType
    | removeTodolistACTYPE
export const ReducerTasks = (state: TasksStateType, action: tsarReducerTask) => {
    switch (action.type) {
        case "UPDATE-TASK": {
            let tasks = {...state}
            return {
                ...tasks,
                [action.payload.todolistId]: tasks[action.payload.todolistId].map(m => m.id === action.payload.id ? {
                    ...m,
                    title: action.payload.LocalTitle
                } : m)
            }
        }
        case "ADD-TASK": {
            let tasks = {...state}
            let task = {id: v1(), title: action.payload.title, isDone: false};
            let todolistTasks = tasks[action.payload.todolistId];
            tasks[action.payload.todolistId] = [task, ...todolistTasks];
            return {...tasks}
        }
        case "REMOVE-TASK": {
            let todolistTasks = state[action.payload.todolistId]
            state[action.payload.todolistId] = todolistTasks.filter(t => t.id != action.payload.id);
            return state
        }
        case "CHANGE_STATUS": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(m => m.id === action.payload.id ? {
                    ...m,
                    isDone: action.payload.isDone
                } : m)
            }
        }
        case "REMOVE-TODOLIST": {
            let task = {...state}
            delete task[action.payload.id]
            return {...task}
        }
        default:
            return state
    }
};
type updateTaskACType = ReturnType<typeof updateTaskAC>
type addTaskACType = ReturnType<typeof addTaskAC>
type removeTaskACTYpe = ReturnType<typeof removeTaskAC>
type changeStatusACType = ReturnType<typeof changeStatusAC>
type removeTodolistACTYPE = ReturnType<typeof removeTodolistAC>
export const updateTaskAC = (todolistId: string, id: string, LocalTitle: string) => {
    return {
        type: 'UPDATE-TASK',
        payload: {
            todolistId,
            id,
            LocalTitle
        }
    } as const
}
export const addTaskAC = (title: string, todolistId: string) => {
    return {
        type: 'ADD-TASK',
        payload: {
            title,
            todolistId
        }
    } as const
}
export const removeTaskAC = (id: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            id,
            todolistId
        }
    } as const
}
export const changeStatusAC = (id: string, isDone: boolean, todolistId: string) => {
    return {
        type: 'CHANGE_STATUS',
        payload: {
            id,
            isDone,
            todolistId
        }
    } as const
}
export const removeTodolistAC = (id: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id
        }
    } as const
}




