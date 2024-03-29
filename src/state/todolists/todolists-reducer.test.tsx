import React from 'react';
import {
    addTodolistTC, changeTodolistFilterAC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType,
    todolistsReducer, updateTodolist
} from './todolists-reducer';
import {v1} from 'uuid';


test('correct todolist should be removed', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    const startState: Array<TodolistDomainType> = [
        {id: todolistId1, title: "What to learn", filter: "all", entityStatus: "idle", addedDate: '', order: 0},
        {id: todolistId2, title: "What to buy", filter: "all", entityStatus: "idle", addedDate: '', order: 0}
    ]

    const endState = todolistsReducer(startState, removeTodolistTC.fulfilled({todolistId: todolistId1}, "request", todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let newTodolistTitle = "New TodolistList";

    const startState: Array<TodolistDomainType> = [
        {id: todolistId1, title: "What to learn", filter: "all", entityStatus: "idle", addedDate: '', order: 0},
        {id: todolistId2, title: "What to buy", filter: "all", entityStatus: "idle", addedDate: '', order: 0}
    ]
    const endState = todolistsReducer(startState, addTodolistTC.fulfilled({
        todolist: {
            title: newTodolistTitle,
            id: v1(),
            order: 0,
            addedDate: ""
        }
    }, "request", {title: newTodolistTitle}))

    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe(newTodolistTitle);
    expect(endState[2].filter).toBe("all");
    expect(endState[2].id).toBeDefined();
});

test('correct todolist should change its name', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let newTodolistTitle = "New TodolistList";

    const startState: Array<TodolistDomainType> = [
        {id: todolistId1, title: "What to learn", filter: "all", entityStatus: "idle", addedDate: '', order: 0},
        {id: todolistId2, title: "What to buy", filter: "all", entityStatus: "idle", addedDate: '', order: 0}
    ]


    const action = updateTodolist.fulfilled({
        todolistId: todolistId2,
        title: newTodolistTitle
    }, "request", {todolistId: todolistId2, title: newTodolistTitle});

    const endState = todolistsReducer(startState, action);

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let newFilter: FilterValuesType = "completed";

    const startState: Array<TodolistDomainType> = [
        {id: todolistId1, title: "What to learn", filter: "all", entityStatus: "idle", addedDate: '', order: 0},
        {id: todolistId2, title: "What to buy", filter: "all", entityStatus: "idle", addedDate: '', order: 0}
    ]

    const action = changeTodolistFilterAC({todolistId: todolistId2, filter:newFilter});
    const endState = todolistsReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});



