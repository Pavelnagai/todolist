import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType, TaskType} from "./App";

type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskID: string) => void
    changeFilter: (filter: FilterValuesType) => void
    addTask: (newTaskTitle: string) => void
    changeTaskStatus: (taskID: string, isDone: boolean) => void
    filter: FilterValuesType
}


const TodoList = (props: PropsType) => {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<boolean>(false)
    const addTask = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            props.addTask(trimmedTitle)
        } else {
            setError(true)
        }
        setTitle('')
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(false)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addTask()
        }
    }
    const tsarButton = (value: FilterValuesType) => {
        props.changeFilter(value)
    }
    const classNameFilter = (filter: FilterValuesType) => props.filter === filter ? 'active-filter' : ''
    const tasksJSX = props.tasks.map(task => {
        const changeStatus = (e: React.ChangeEvent<HTMLInputElement>) =>
            props.changeTaskStatus(task.id, e.currentTarget.checked)
        const removeTask = () => props.removeTask(task.id)
        return (
            <li key={task.id} className={task.isDone ? 'is-done' : ''}>
                <input type="checkbox"
                       checked={task.isDone}
                       onChange={changeStatus}/>
                <span>{task.title}</span>
                <button onClick={removeTask}>x</button>
            </li>
        )
    })
    const errorMessage = <div style={{color: 'red'}}>Title is required</div>
    const errorClass = error ? 'error' : ''
    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input
                    value={title}
                    onChange={onChangeHandler}
                    onKeyPress={onKeyPressHandler}
                    className={errorClass}
                />
                <button onClick={addTask}>+</button>
                {error && errorMessage}
            </div>
            <ul>
                {tasksJSX}
            </ul>
            <div>
                <button className={classNameFilter('all')}
                        onClick={() => tsarButton('all')}>All
                </button>
                <button className={classNameFilter('active')}
                        onClick={() => tsarButton('active')}>Active
                </button>
                <button className={classNameFilter('completed')}
                        onClick={() => tsarButton('completed')}>Completed
                </button>
            </div>
        </div>
    )
}
export default TodoList