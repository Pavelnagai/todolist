import React, {useCallback, useEffect} from 'react';
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {AppRootStateType, useAppSelector} from "../../state/store/store";
import {TaskStatuses} from "../../api/todolist-api";
import {
    addTaskThunkCreator,
    removeTaskThunkCreator,
    TasksStateType,
    updateTaskTC
} from "../../state/tasks/tasks-reducer";
import {
    changeTodolistFilterAC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    addTodolistTC,
    TodolistDomainType,
    updateTodolist
} from "../../state/todolists/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

const TodolistList = () => {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.authReducer.isLoggedIn)
    const todolists = useAppSelector<TodolistDomainType[]>(state => state.todolistsReducer)
    const tasks = useAppSelector<TasksStateType>(state => state.tasksReducer)
    const dispatch = useDispatch()

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchTodolistsTC())
        }
    }, [dispatch])

    const removeTask = useCallback((taskId: string, todolistId: string) => {
        dispatch(removeTaskThunkCreator({todolistId, taskId}))
    }, [dispatch])

    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(addTaskThunkCreator({todolistId, title}))
    }, [dispatch])

    const changeStatus = useCallback((taskId: string, status: TaskStatuses, todolistId: string) => {
        dispatch(updateTaskTC({taskId, domainModel: {status}, todolistId}))
    }, [dispatch])

    const changeTaskTitle = useCallback((taskId: string, title: string, todolistId: string) => {
        dispatch(updateTaskTC({taskId, domainModel: {title}, todolistId}))
    }, [dispatch])

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilterAC({todolistId, filter: value}))
    }, [dispatch])

    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(removeTodolistTC(todolistId))
    }, [dispatch])

    const changeTodolistTitle = useCallback((todolistId: string, title: string) => {
        dispatch(updateTodolist({todolistId, title}))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC({title}))
    }, [dispatch])
    if (!isLoggedIn) {
        return <Navigate to={'login'}/>
    }
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
                                    entityStatus={tl.entityStatus}
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