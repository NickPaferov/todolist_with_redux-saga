import {
    AddTodolistActionType,
    ClearStateActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from "./todolists-reducer";
import {CommonResponseType, GetTasksResponse, TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolist-api";
import {store} from "../../app/store";
import {AppActionsType, RequestStatusType, setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {AxiosError, AxiosResponse} from "axios";
import {call, put} from "redux-saga/effects";

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            action.todolists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case 'SET-TASKS': {
            return {...state, [action.todolistId]: action.tasks.map(t => ({...t, entityStatus: 'idle'}))}
        }
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {
                ...state, [action.task.todoListId]:
                    [{...action.task, entityStatus: 'idle'}, ...state[action.task.todoListId]]
            }
        case 'UPDATE-TASK':
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case "CHANGE-TASK-ENTITY-STATUS":
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, entityStatus: action.entityStatus} : t)
            }
        case "ADD-TODOLIST":
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            const copyState = {...state}
            delete copyState[action.id]
            return copyState
        case "CLEAR-STATE":
            return {}
        default:
            return state
    }
}

// AC
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', taskId, model, todolistId} as const)
export const setTasksAC = (todolistId: string, tasks: TaskType[]) =>
    ({type: 'SET-TASKS', todolistId, tasks} as const)
export const changeTaskEntityStatusAC = (todolistId: string, taskId: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE-TASK-ENTITY-STATUS', todolistId, taskId, entityStatus} as const)


// sagas

export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
    yield put(setAppStatusAC('loading'))
    try {
        const res: AxiosResponse<GetTasksResponse> = yield call(todolistAPI.getTasks, action.todolistId)
        const tasks = res.data.items
        yield put(setTasksAC(action.todolistId, tasks))
        yield put(setAppStatusAC('succeeded'))
    } catch (err) {
        const error = err as Error | AxiosError
        yield put(setAppErrorAC(error.message))
        yield put(setAppStatusAC('failed'))
    }
}

export function* addTaskWorkerSaga(action: ReturnType<typeof createTask>) {
    yield put(setAppStatusAC('loading'))
    try {
        const res: AxiosResponse<CommonResponseType<{ item: TaskType }>> = yield call(todolistAPI.createTask, action.todolistId, action.taskTitle)
        if (res.data.resultCode === 0) {
            const newTask = res.data.data.item
            yield put(addTaskAC(newTask))
            yield put(setAppStatusAC('succeeded'))
        } else {
            if (res.data.messages.length) {
                yield put(setAppErrorAC(res.data.messages[0]))
            } else {
                yield put(setAppErrorAC('Some error occurred'))
            }
            yield put(setAppStatusAC('failed'))
        }
    } catch (err) {
        const error = err as Error | AxiosError
        yield put(setAppErrorAC(error.message))
        yield put(setAppStatusAC('failed'))
    }
}

export function* removeTaskWorkerSaga(action: ReturnType<typeof deleteTask>) {
    yield put(setAppStatusAC('loading'))
    yield put(changeTaskEntityStatusAC(action.todolistId, action.taskId, 'loading'))
    try {
        const res: AxiosResponse<CommonResponseType> = yield call(todolistAPI.deleteTask, action.todolistId, action.taskId)
        if (res.data.resultCode === 0) {
            yield put(removeTaskAC(action.taskId, action.todolistId))
            yield put(setAppStatusAC('succeeded'))
        } else {
            if (res.data.messages.length) {
                yield put(setAppErrorAC(res.data.messages[0]))
            } else {
                yield put(setAppErrorAC('Some error occurred'))
            }
            yield put(setAppStatusAC('failed'))
            yield put(changeTaskEntityStatusAC(action.todolistId, action.taskId, 'failed'))
        }
    } catch (err) {
        const error = err as Error | AxiosError
        yield put(setAppErrorAC(error.message))
        yield put(setAppStatusAC('failed'))
    }
}

export function* updateTaskWorkerSaga(action: ReturnType<typeof updateTask>) {
    const state = store.getState()
    const allTask = state.tasks
    const tasksForCurrentTodolist = allTask[action.todolistId]
    const changedTask = tasksForCurrentTodolist.find((t) => {
        return t.id === action.taskId
    })
    if (changedTask) {
        const apiModel: UpdateTaskModelType = {
            status: changedTask.status,
            title: changedTask.title,
            completed: changedTask.completed,
            description: changedTask.description,
            deadline: changedTask.deadline,
            priority: changedTask.priority,
            startDate: changedTask.startDate,
            ...action.domainModel
        }
        yield put(setAppStatusAC('loading'))
        try {
            const res: AxiosResponse<CommonResponseType<{ item: TaskType }>> = yield call(todolistAPI.updateTask, action.todolistId, action.taskId, apiModel)
            if (res.data.resultCode === 0) {
                yield put(updateTaskAC(action.taskId, action.domainModel, action.todolistId))
                yield put(setAppStatusAC('succeeded'))
            } else {
                if (res.data.messages.length) {
                    yield put(setAppErrorAC(res.data.messages[0]))
                } else {
                    yield put(setAppErrorAC('Some error occurred'))
                }
                yield put(setAppStatusAC('failed'))
            }
        } catch (err) {
            const error = err as Error | AxiosError
            yield put(setAppErrorAC(error.message))
            yield put(setAppStatusAC('failed'))
        }
    }
}

export const fetchTasks = (todolistId: string) => ({type: 'TASKS/FETCH-TASKS', todolistId} as const)
export const createTask = (todolistId: string, taskTitle: string) => ({
    type: 'TASKS/CREATE-TASK',
    todolistId,
    taskTitle
} as const)
export const deleteTask = (todolistId: string, taskId: string) => ({
    type: 'TASKS/DELETE-TASK',
    todolistId,
    taskId
} as const)
export const updateTask = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => ({
    type: 'TASKS/UPDATE-TASK',
    todolistId,
    taskId,
    domainModel
} as const)

// types
type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
type AddTaskActionType = ReturnType<typeof addTaskAC>
type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
type SetTasksActionType = ReturnType<typeof setTasksAC>
type ChangeTaskEntityStatusActionType = ReturnType<typeof changeTaskEntityStatusAC>
type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    completed?: boolean
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}
type FetchTasksType = ReturnType<typeof fetchTasks>
type CreateTaskType = ReturnType<typeof createTask>
type DeleteTaskType = ReturnType<typeof deleteTask>
type UpdateTaskType = ReturnType<typeof updateTask>

export type TasksActionsType =
    | RemoveTaskActionType
    | AddTaskActionType
    | UpdateTaskActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTasksActionType
    | AppActionsType
    | ChangeTaskEntityStatusActionType
    | ClearStateActionType
    | FetchTasksType
    | CreateTaskType
    | DeleteTaskType
    | UpdateTaskType

export type TasksStateType = {
    [todoListID: string]: Array<TaskDomainType>
}

export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}