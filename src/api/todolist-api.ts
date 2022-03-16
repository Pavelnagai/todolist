import axios, {AxiosResponse} from "axios";
import {TaskType} from "../components/TodolistList/Todolist/Todolist";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '2a3c113a-9f81-44c2-8055-fcb19926514f'
    }
})

export const todolistAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists');
    },
    createTodolist(title: string) {
        return instance.post('/todo-lists/', {title})
    },
    removeTodolist(todolistId: string) {
        return instance.delete(`/todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put(`/todo-lists/${todolistId}`, {title})
    },
    getTask(todolistId: string) {
        return instance.get(`todo-lists/${todolistId}/tasks`)
    },
    setTask(todolistId: string, title: string) {
        return instance.post(`/todo-lists/${todolistId}/tasks`, {title})
    },
    removeTask(todolistId: string, taskId: string) {
        return instance.delete(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<UpdateTaskModelType, AxiosResponse<ResponseType<{ item: TaskType }>>>
        (`todo-lists/${todolistId}/tasks/${taskId}`, model);
    }
}


export const AuthApi = {
    login(data: LoginParamsType) {
        return instance.post<LoginParamsType, AxiosResponse<ResponseType<{ userId: number }>>>('/auth/login', data)
    },
    me() {
        return instance.get<ResponseType<MeRequestType>>('/auth/me')
    },
    logout(){
        return instance.delete<ResponseType>('/auth/login')
    }
}


export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type UpdateTaskModelType = {
    title?: string
    description?: string
    completed?: boolean
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}
export type MeRequestType = {
    id: number,
    email: string,
    login: string
}
export type LoginParamsType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: string
}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}