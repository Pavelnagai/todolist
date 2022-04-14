import {
    addTaskThunkCreator,
    changeTaskStatusAC,
    removeTaskThunkCreator,
    tasksReducer,
    TasksStateType, updateTaskTC
} from './tasks-reducer';
import {TaskPriorities, TaskStatuses} from "../../api/todolist-api";
import {addTodolistTC, removeTodolistTC} from "../todolists/todolists-reducer";

let startState: TasksStateType
beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                startDate: '',
                addedDate: "",
                deadline: "",
                order: 0,
                description: "",
                priority: TaskPriorities.Low,
                todoListId: "todolistId1"
            },
            {
                id: "2",
                title: "CSS",
                status: TaskStatuses.New,
                startDate: '',
                addedDate: "",
                deadline: "",
                order: 0,
                description: "",
                priority: TaskPriorities.Low,
                todoListId: "todolistId1"
            },
            {
                id: "3",
                title: "CSS",
                status: TaskStatuses.New,
                startDate: '',
                addedDate: "",
                deadline: "",
                order: 0,
                description: "",
                priority: TaskPriorities.Low,
                todoListId: "todolistId1"
            },
        ],
        "todolistId2": [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                startDate: '',
                addedDate: "",
                deadline: "",
                order: 0,
                description: "",
                priority: TaskPriorities.Low,
                todoListId: "todolistId2"
            },
            {
                id: "2",
                title: "CSS",
                status: TaskStatuses.New,
                startDate: '',
                addedDate: "",
                deadline: "",
                order: 0,
                description: "",
                priority: TaskPriorities.Low,
                todoListId: "todolistId2"
            },
            {
                id: "3",
                title: "CSS",
                status: TaskStatuses.New,
                startDate: '',
                addedDate: "",
                deadline: "",
                order: 0,
                description: "",
                priority: TaskPriorities.Low,
                todoListId: "todolistId2"
            },
        ]
    };
})

test('correct task should be deleted from correct array', () => {
    const action = removeTaskThunkCreator.fulfilled({taskId: "2", todolistId: "todolistId2"}, "reqestId", {
        taskId: "2",
        todolistId: "todolistId2"
    });
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(2);
    expect(endState["todolistId2"].every(t => t.id != "2")).toBeTruthy();
});

test('correct task should be added to correct array', () => {

    const action = addTaskThunkCreator.fulfilled({
        task: {
            id: "4",
            title: "juce",
            status: 0,
            startDate: '',
            addedDate: "",
            deadline: "",
            order: 0,
            description: "",
            priority: TaskPriorities.Low,
            todoListId: "todolistId1"
        },
    }, "request", {
        title: "juce",
        todolistId: "todolistId1"
    });
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(4);
    expect(endState["todolistId1"][3].id).toBeDefined();
    expect(endState["todolistId1"][3].title).toBe("juce");
    expect(endState["todolistId1"][3].status).toBe(0);
})

test('status of specified task should be changed', () => {

    const action = changeTaskStatusAC({taskId: "2", status: "idle", todolistId: "todolistId2"});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].status).toBe(0);
    expect(endState["todolistId1"][1].status).toBe(0);
});

test('title of specified task should be changed', () => {
    const payload = {taskId: "2", model: {title: "Milkyway"}, todolistId: "todolistId2"}
    const action = updateTaskTC.fulfilled(payload, "requestId", {
        taskId: "2",
        domainModel: {title: payload.model.title},
        todolistId: "todolistId2"
    });
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe("Milkyway");
    expect(endState["todolistId1"][1].title).toBe("CSS");
});

test('new property with new array should be added when new todolist is added', () => {

    const action = addTodolistTC.fulfilled({
        todolist:
            {id: "todolistId3", title: "", addedDate: '', order: 0},
    }, "requestId", {title: "lay"});
    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toStrictEqual([]);
});

test('propertry with todolistId should be deleted', () => {

    const action = removeTodolistTC.fulfilled({todolistId: "todolistId2"}, "re", "todolistId2");
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).toBeUndefined();
});




