import {
    AddTodolistActionType,
    ClearStateActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from "./todolists-reducer";
import {TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolist-api";
import {Dispatch} from 'redux';
import {AppRootStateType} from "../../app/store";
import {AppActionsType, RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleAppError, handleNetworkError} from "../../utils/error-utils";

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


// thunk
/*export const fetchTasksThunk = (dispatch: Dispatch) => {
    todolistAPI.getTasks(todolistId)
        .then((res) => {
                const tasks = res.data.items
                const action = setTasksAC(todolistId, tasks)
                dispatch(action)
            }
        )
}*/

// TC
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<TasksActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTasksAC(todolistId, tasks))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((error: AxiosError) => {
            handleNetworkError(dispatch, error.message)
        })
}
export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<TasksActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'))
    todolistAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleAppError(dispatch, res.data)
                dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'))
            }
        })
        .catch((error: AxiosError) => {
            handleNetworkError(dispatch, error.message)
        })
}
export const addTaskTC = (todolistId: string, taskTitle: string) => (dispatch: Dispatch<TasksActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.createTask(todolistId, taskTitle)
        .then((res) => {
            if (res.data.resultCode === 0) {
                const newTask = res.data.data.item
                dispatch(addTaskAC(newTask))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleAppError(dispatch, res.data)
            }
        })
        .catch((error: AxiosError) => {
            handleNetworkError(dispatch, error.message)
        })
}
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch<TasksActionsType>, getState: () => AppRootStateType) => {
        const state = getState()
        const allTask = state.tasks
        const tasksForCurrentTodolist = allTask[todolistId]
        const changedTask = tasksForCurrentTodolist.find((t) => {
            return t.id === taskId
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
                ...domainModel
            }
            dispatch(setAppStatusAC('loading'))
            todolistAPI.updateTask(todolistId, taskId, apiModel)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(updateTaskAC(taskId, domainModel, todolistId))
                        dispatch(setAppStatusAC('succeeded'))
                    } else {
                        handleAppError(dispatch, res.data)
                    }
                })
                .catch((error: AxiosError) => {
                    handleNetworkError(dispatch, error.message)
                })
        }
    }

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
export type TasksStateType = {
    [todoListID: string]: Array<TaskDomainType>
}
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}