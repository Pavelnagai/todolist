import React, {ChangeEvent} from 'react';
import {FilterValuesType} from './App';
import Input from "./components/Input";
import EditableSpan from "./components/EditableSpan";
import {Button, IconButton, Tooltip} from "@mui/material";
import {DeleteRounded} from "@mui/icons-material";


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

    // const callBackForEditableSpanHandler=(title: string)=>{
    //     props.updateTask(props.id,t.id,LocalTitle:string)
    // }

    const callBackForEditableSpanShapkaHandler = (title: string) => {
        props.updateTodolist(props.id, title)
    }

    return <div>
        <h3>
            {/*{props.title}*/}
            <EditableSpan title={props.title} callBackForEditableSpan={callBackForEditableSpanShapkaHandler}/>
            {/*<button onClick={removeTodolist}>x</button>*/}
            {/*<Button variant="contained" onClick={removeTodolist}>x</Button>*/}
            <Tooltip title="Delete">
                <IconButton>
                    <DeleteRounded onClick={removeTodolist}/>
                </IconButton>
            </Tooltip>
        </h3>
        <div>
            <Input callback={callbackHandler}/>
            {/*<TextField id="filled-basic" label="Filled" variant="filled" callback={callbackHandler}/>*/}

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
                        {/*<CheckBoxIcon />*/}
                        {/*<span>{t.title}</span>*/}
                        <EditableSpan title={t.title} callBackForEditableSpan={callBackForEditableSpanHandler}/>
                        {/*<button onClick={onClickHandler}>x</button>*/}
                        <Tooltip title="Delete">
                            <IconButton>
                                <DeleteRounded onClick={onClickHandler}/>
                            </IconButton>
                        </Tooltip>
                    </li>
                })
            }
        </ul>
        <div>
            <Button variant="contained" className={props.filter === 'all' ? "active-filter" : ""}
                    onClick={onAllClickHandler} size={"small"}>All</Button>
            <Button variant="contained" className={props.filter === 'active' ? "active-filter" : ""}
                    onClick={onActiveClickHandler} size={"small"}>Active</Button>
            <Button variant="contained" className={props.filter === 'completed' ? "active-filter" : ""}
                    onClick={onCompletedClickHandler} size={"small"}>Completed</Button>

        </div>
    </div>
}


