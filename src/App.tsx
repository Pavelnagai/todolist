import React, {useState} from 'react';
import './App.css';
import TodoList from "./ToDoList";
import {v1} from "uuid";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
export type FilterValuesType = "all" | "active" | "completed"

function App() {
    //BLL:
    const todoListTitle: string = "What to learn"
    const [tasks, setTasks] = useState<Array<TaskType>>([
        {id: v1(), title: "HTML", isDone: true},
        {id: v1(), title: "CSS", isDone: true},
        {id: v1(), title: "REACT", isDone: false},
    ])
    const [filter, setFilter] = useState<FilterValuesType>("all")
    const removeTask = (tasksID: string) => setTasks(tasks.filter(task => task.id !== tasksID))
    const changeFilter = (filter: FilterValuesType) => setFilter(filter)
    const addTask = (newTaskTitle: string) => {
        const newTask: TaskType = {
            id: v1(),
            title: newTaskTitle,
            isDone: false
        }
        setTasks([...tasks, newTask])
    }

    let tasksForRender = tasks
    if (filter === "active") {
        tasksForRender = tasks.filter(t => t.isDone === false)
    }
    if (filter === "completed") {
        tasksForRender = tasks.filter(t => t.isDone === true)
    }


    //UL:
    return (
        <div className="App">
            <TodoList
                title={todoListTitle}
                tasks={tasksForRender}
                removeTask={removeTask}
                changeFilter={changeFilter}
                addTask={addTask}
            />

        </div>
    );
}

export default App;
