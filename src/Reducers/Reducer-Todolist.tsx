import React from 'react';
import {FilterValuesType, TodolistType} from "../App";
import {v1} from "uuid";

type tsarType = ReduceUpdateTodolistACType | ReducerAddTodolistAC
    | ReduceRemoveTodolistType | FilterACType
export const ReduceUpdateTodolist = (state: TodolistType[], action: tsarType) => {
    switch (action.type) {
        case "UPDATE-TODOLIST": {
            let newStateUpdate = [...state]
            return newStateUpdate.map(m => m.id === action.payload.todolistId ? {
                ...m,
                title: action.payload.LocalTitle
            } : m)
        }
        case "ADD_TODOLIST": {
            let newID = v1();
            let newList: TodolistType = {id: newID, title: action.payload.title, filter: 'all'}
            return [newList, ...state]
        }
        case "REMOVE-TODOLIST": {
            let stateRemove = [...state]
            return stateRemove.filter(tl => tl.id !== action.payload.id)
        }
        case "CHANGE-FILTER": {
            return state.map(tl => tl.id === action.payload.todolistId ? {...tl, filter: action.payload.value} : tl);
        }
        default:
            return state
    }
};
type ReduceUpdateTodolistACType = ReturnType<typeof ReduceUpdateTodolistAC>
type ReducerAddTodolistAC = ReturnType<typeof ReducerAddTodolistAC>
type ReduceRemoveTodolistType = ReturnType<typeof ReduceRemoveTodolistAC>
type FilterACType = ReturnType<typeof FilterAC>
export const ReduceUpdateTodolistAC = (todolistId: string, LocalTitle: string) => {
    return {
        type: "UPDATE-TODOLIST",
        payload: {
            todolistId: todolistId,
            LocalTitle: LocalTitle
        }
    } as const
}
export const ReducerAddTodolistAC = (title: string) => {
    return {
        type: 'ADD_TODOLIST',
        payload: {
            title: title
        }
    } as const
}
export const ReduceRemoveTodolistAC = (id: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id,
        }
    } as const
}
export const FilterAC = (value: FilterValuesType, todolistId: string) => {
    return {
        type: 'CHANGE-FILTER',
        payload: {
            value,
            todolistId
        }
    } as const
}



