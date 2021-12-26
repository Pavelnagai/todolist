import React, {useReducer, useState} from 'react';
import './App.css';

import {v1} from 'uuid';
import Input from "./components/Input/Input";
import ButtonAppBar from "./components/ButtonAppBar/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {TaskType, Todolist} from "./ToDoList";
import {
    FilterAC,
    ReducerAddTodolistAC,
    ReduceRemoveTodolistAC,
    ReduceUpdateTodolist,
    ReduceUpdateTodolistAC
} from "./Reducers/Reducer-Todolist";
import {
    addTaskAC,
    changeStatusAC,
    ReducerTasks,
    removeTaskAC,
    removeTodolistAC,
    updateTaskAC
} from "./Reducers/Reducer-tasks";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function App() {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let [todolists, todolistDispatch] = useReducer(ReduceUpdateTodolist, [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ])

    let [tasks, tasksDispatch] = useReducer(ReducerTasks, {
        [todolistId1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true}
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "React Book", isDone: true}
        ]
    });

    const updateTodolist = (todolistId: string, LocalTitle: string) => {
        todolistDispatch(ReduceUpdateTodolistAC(todolistId, LocalTitle))
    }

    const updateTask = (todolistId: string, id: string, LocalTitle: string) => {
        tasksDispatch(updateTaskAC(todolistId, id, LocalTitle))
    }

    function removeTask(id: string, todolistId: string) {
        tasksDispatch(removeTaskAC(id, todolistId))
    }

    const addTodolist = (title: string) => {
        todolistDispatch(ReducerAddTodolistAC(title))
        // setTasks({...tasks, [newID]: []})
    }

    function addTask(title: string, todolistId: string) {
        tasksDispatch(addTaskAC(title, todolistId))
    }

    function changeStatus(id: string, isDone: boolean, todolistId: string) {
        tasksDispatch(changeStatusAC(id, isDone, todolistId))
    }


    function changeFilter(value: FilterValuesType, todolistId: string) {
        todolistDispatch(FilterAC(value, todolistId))
    }

    function removeTodolist(id: string) {
        todolistDispatch(ReduceRemoveTodolistAC(id))
        tasksDispatch(removeTodolistAC(id))
    }

    return (

        <div className="App">
            <ButtonAppBar/>

            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <Input callback={(title) => addTodolist(title)}/>
                </Grid>

                <Grid container spacing={3}>
                    {todolists.map(tl => {
                        let allTodolistTasks = tasks[tl.id];
                        let tasksForTodolist = allTodolistTasks;

                        if (tl.filter === "active") {
                            tasksForTodolist = allTodolistTasks.filter(t => t.isDone === false);
                        }
                        if (tl.filter === "completed") {
                            tasksForTodolist = allTodolistTasks.filter(t => t.isDone === true);
                        }


                        return <Grid item>
                            <Paper style={{padding: "10px"}}>
                                <Todolist
                                    key={tl.id}
                                    id={tl.id}
                                    title={tl.title}
                                    tasks={tasksForTodolist}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    filter={tl.filter}
                                    removeTodolist={removeTodolist}
                                    updateTask={updateTask}
                                    updateTodolist={updateTodolist}
                                />
                            </Paper>
                        </Grid>
                    })}
                </Grid>

            </Container>
        </div>
    );
}

export default App;
