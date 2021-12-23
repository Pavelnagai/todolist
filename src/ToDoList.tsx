import React, {ChangeEvent} from 'react';
import {FilterValuesType} from './App';
import Input from "./components/Input/Input";
import EditableSpan from "./components/EditableSpan/EditableSpan";


import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (id: string) => void
    filter: FilterValuesType
    updateTask: (todolistId: string, id: string, LocalTitle: string) => void
    updateTodolist: (todolistId: string, LocalTitle: string) => void
}

export function Todolist(props: PropsType) {

    const removeTodolist = () => props.removeTodolist(props.id)

    const onAllClickHandler = () => props.changeFilter("all", props.id);
    const onActiveClickHandler = () => props.changeFilter("active", props.id);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.id);

    const callbackHandler = (title: string) => {
        props.addTask(title, props.id)
    }


    const callBackForEditableSpanShapkaHandler = (title: string) => {
        props.updateTodolist(props.id, title)
    }

    return <div>
        <h3>
            {/*{props.title}*/}
            <EditableSpan title={props.title} callBackForEditableSpan={callBackForEditableSpanShapkaHandler}/>
            {/*<button onClick={removeTodolist}>x</button>*/}
            <IconButton onClick={removeTodolist} aria-label="delete">
                <Delete/>
            </IconButton>
        </h3>
        <div>
            <Input callback={callbackHandler}/>
        </div>
        <ul>
            {
                props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(t.id, props.id)
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        props.changeTaskStatus(t.id, newIsDoneValue, props.id);
                    }
                    const callBackForEditableSpanHandler = (title: string) => {
                        props.updateTask(props.id, t.id, title)
                    }

                    return <li key={t.id} className={t.isDone ? "is-done" : ""}>
                        <input type="checkbox" onChange={onChangeHandler} checked={t.isDone}/>
                        {/*<span>{t.title}</span>*/}
                        <EditableSpan title={t.title} callBackForEditableSpan={callBackForEditableSpanHandler}/>
                        {/*<button onClick={onClickHandler}>x</button>*/}
                        <IconButton onClick={onClickHandler} aria-label="delete">
                            <Delete/>
                        </IconButton>
                    </li>
                })
            }
        </ul>
        <div>
            <Button variant={props.filter === 'all' ? "contained" : "outlined"} color="error"
                    onClick={onAllClickHandler}>All</Button>
            <Button variant={props.filter === 'active' ? "contained" : "outlined"} color="secondary"
                    onClick={onActiveClickHandler}>Active</Button>
            <Button variant={props.filter === 'completed' ? "contained" : "outlined"} color="success"
                    onClick={onCompletedClickHandler}>Completed</Button>

            {/*<button className={props.filter === 'all' ? "active-filter" : ""} onClick={onAllClickHandler}>All</button>*/}
            {/*<button className={props.filter === 'active' ? "active-filter" : ""} onClick={onActiveClickHandler}>Active</button>*/}
            {/*<button className={props.filter === 'completed' ? "active-filter" : ""} onClick={onCompletedClickHandler}>Completed</button>*/}
        </div>
    </div>
}


