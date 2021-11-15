import React, {useState} from 'react';
import './App.css';
import TodoList from "./ToDoList";

export type TaskType = {
    id: number
    title: string
    isDone: boolean

}
export type FilterValuesType = "all" | "active" | "complited"

function App() {
    //BLL:
    const todoListTitle: string = "What to learn"
    const [tasks, setTasks] = useState<Array<TaskType>>([
        {id: 1, title: "HTML", isDone: true},
        {id: 2, title: "CSS", isDone: true},
        {id: 3, title: "REACT", isDone: false},
    ])
    // const tasks = result[0]
    // const setTasks = result[1]
    const [filter, setFilter] = useState<FilterValuesType>("all")
    const removeTask = (tasksID: number) => {
        setTasks(tasks.filter(task => task.id !== tasksID))
        console.log(tasks)
    }
    const changeFilter = (filter: FilterValuesType) => {
        setFilter(filter)
    }

    let tasksForRender = tasks
    if (filter === "active") {
        tasksForRender = tasks.filter(t => t.isDone === false)
    }
    if (filter === "complited") {
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
            />

        </div>
    );
}

export default App;
