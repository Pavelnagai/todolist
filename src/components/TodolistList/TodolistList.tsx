import React, {useCallback, useEffect} from 'react';
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {useAppSelector} from "../../state/store/store";
import {FilterValuesType, TaskStatuses, TodolistDomainType} from "../../api/todolist-api";
import {
    addTaskThunkCreator,
    removeTaskThunkCreator,
    TasksStateType,
    updateTaskTC
} from "../../state/tasks/tasks-reducer";
import {
    changeTodolistFilterAC,
    fetchTodolistsTC,
    removeTodolistTC,
    setTodolistTC,
    updateTodolist
} from "../../state/todolists/todolists-reducer";
import {useDispatch} from "react-redux";

const TodolistList = () => {
    const todolists = useAppSelector<TodolistDomainType[]>(state => state.todolistsReducer)
    const tasks = useAppSelector<TasksStateType>(state => state.tasksReducer)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [])

    const removeTask = useCallback((id: string, todolistId: string) => {
        dispatch(removeTaskThunkCreator(todolistId, id))
    }, [dispatch])

    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(addTaskThunkCreator(todolistId, title))
    }, [dispatch])

    const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
        dispatch(updateTaskTC(id, {status}, todolistId))
    }, [dispatch])

    const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
        dispatch(updateTaskTC(id, {title:newTitle}, todolistId))
    }, [dispatch])

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilterAC(todolistId, value))
    }, [dispatch])

    const removeTodolist = useCallback((id: string) => {
        dispatch(removeTodolistTC(id))
    }, [dispatch])

    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(updateTodolist(id, title))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(setTodolistTC(title))
    }, [dispatch])
    return (
        <>
            <Grid container style={{padding: "20px"}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {
                        return <Grid item key={tl.id}>
                            <Paper style={{padding: "10px"}}>
                                <Todolist
                                    key={tl.id}
                                    id={tl.id}
                                    title={tl.title}
                                    tasks={tasks[tl.id]}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    filter={tl.filter}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </>
    );
};

export default TodolistList;