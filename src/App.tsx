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
export type TodolistsType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    //BLL:
    let todolistID1 = v1();
    let todolistID2 = v1();

    let [todolists, setTodolists] = useState<Array<TodolistsType>>([
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])
    let [tasks, setTasks] = useState<TasksStateType>({
        [todolistID1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: "HTML&CSS2", isDone: true},
            {id: v1(), title: "JS2", isDone: true},
            {id: v1(), title: "ReactJS2", isDone: false},
            {id: v1(), title: "Rest API2", isDone: false},
            {id: v1(), title: "GraphQL2", isDone: false},
        ]
    });
    const removeTask = (todolistId: string, tasksID: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].filter(t => t.id !== tasksID)})
    }
    const changeFilter = (todolistId: string, filter: FilterValuesType) => {
        setTodolists(todolists.filter(t => t.id === todolistId ? {...t, filter: filter} : t))
    }
    const addTask = (todolistId: string, newTaskTitle: string) => {
        const newTask: TaskType = {
            id: v1(),
            title: newTaskTitle,
            isDone: false
        }
        setTasks({...tasks, [todolistId]: [newTask, ...tasks[todolistId]]})
    }
    const changeTaskStatus = (todolistId: string, tasksID: string, isDone: boolean) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].map(t => t.id === tasksID ? {...t, isDone: isDone} : t)})
    }

    //UL:
    return (
        <div className="App">
            {todolists.map(t => {
                let tasksForRender = tasks[t.id]
                if (t.filter === "active") {
                    tasksForRender = tasks[t.id].filter(t => t.isDone === false)
                }
                if (t.filter === "completed") {
                    tasksForRender = tasks[t.id].filter(t => t.isDone === true)
                }
                return <TodoList
                    title={t.title}
                    tasks={tasksForRender}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    addTask={addTask}
                    changeTaskStatus={changeTaskStatus}
                    filter={t.filter}
                    todolistId={t.id}
                />
            })}
        </div>
    );
}

export default App;
