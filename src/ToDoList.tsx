import React, {ChangeEvent,KeyboardEvent, useState} from 'react';
import {FilterValuesType, TaskType} from "./App";

type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskID: string) => void
    changeFilter: (filter: FilterValuesType) => void
    addTask: (newTaskTitle: string) => void
}

const TodoList = (props: PropsType) => {
    const [title, setTitle] = useState<string>("")
    const addTask = () => {
        props.addTask(title)
        setTitle('')
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)
    const onKeyPressHandler =(e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addTask()
        }}
    const onClickAllHandler = () => props.changeFilter("all")
    const onClickActiveHandler = () => props.changeFilter("active")
    const onClickCompletedHandler = () => props.changeFilter("completed")
    const tasksJSX = props.tasks.map(task => {
        return (
            <li key={task.id}>
                <input type="checkbox" checked={task.isDone}/>
                <span>{task.title}</span>
                <button onClick={() => props.removeTask(task.id)}>x</button>
            </li>
        )
    })
    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input
                    value={title}
                    onChange={onChangeHandler}
                    onKeyPress={onKeyPressHandler}
                />
                <button onClick={addTask}>+</button>
            </div>
            <ul>
                {tasksJSX}
            </ul>
            <div>
                <button onClick={onClickAllHandler}>All</button>
                <button onClick={onClickActiveHandler}>Active</button>
                <button onClick={onClickCompletedHandler}>Completed</button>
            </div>
        </div>
    )
}
export default TodoList