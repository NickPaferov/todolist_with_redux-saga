import axios, {AxiosResponse} from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'f457be2a-21e1-421e-9b86-ed16b8a831ce'
    }
})

// api
export const todolistAPI = {
    getTodolists(): Promise<AxiosResponse<Array<TodolistType>>> {
        return instance.get<Array<TodolistType>>('todo-lists')
    },
    createTodolist(title: string): Promise<AxiosResponse<CommonResponseType<{ item: TodolistType }>>> {
        return instance.post<CommonResponseType<{ item: TodolistType }>>('todo-lists', {title})
    },
    deleteTodolist(todolistId: string): Promise<AxiosResponse<CommonResponseType>> {
        return instance.delete<CommonResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolistTitle(todolistId: string, title: string): Promise<AxiosResponse<CommonResponseType>> {
        return instance.put<CommonResponseType>(`todo-lists/${todolistId}`, {title})
    },
    getTasks(todolistId: string): Promise<AxiosResponse<GetTasksResponse>> {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, taskTitle: string): Promise<AxiosResponse<CommonResponseType<{ item: TaskType }>>> {
        return instance.post<CommonResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {title: taskTitle})
    },
    deleteTask(todolistId: string, taskId: string): Promise<AxiosResponse<CommonResponseType>> {
        return instance.delete<CommonResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType): Promise<AxiosResponse<CommonResponseType<{ item: TaskType }>>> {
        return instance.put<CommonResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    }
}

export const authAPI = {
    login(data: LoginParamsType): Promise<AxiosResponse<CommonResponseType>> {
        return instance.post<CommonResponseType<{ userId?: number }>>(`auth/login`, data)
    },
    me(): Promise<AxiosResponse<CommonResponseType<MeResponseType>>> {
        return instance.get<CommonResponseType<MeResponseType>>(`auth/me`)
    },
    logout(): Promise<AxiosResponse<CommonResponseType>> {
        return instance.delete<CommonResponseType<{ userId?: number }>>(`auth/login`)
    }
}

// types
export type LoginParamsType = {
    email: string,
    password: string,
    rememberMe?: boolean,
    captcha?: string
}

type MeResponseType = {
    id: number
    email: string
    login: string
}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type CommonResponseType<T = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: T
}

export enum TaskStatuses {
    New = 0,
    inProgress = 1,
    Completed = 2,
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: Array<TaskType>
}

export type UpdateTaskModelType = {
    title: string
    description: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
}