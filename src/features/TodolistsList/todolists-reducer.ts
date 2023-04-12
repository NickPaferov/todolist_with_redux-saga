import {CommonResponseType, todolistAPI, TodolistType} from '../../api/todolist-api';
import {AppActionsType, RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {AxiosResponse} from "axios";
import {call, put} from 'redux-saga/effects';
import {handleAppErrorSaga, handleNetworkErrorSaga} from "../../utils/error-utils";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state = initialState, action: TodolistsActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
        case "CLEAR-STATE":
            return []
        default:
            return state
    }
}

// AC
export const removeTodolistAC = (todolistId: string) =>
    ({type: 'REMOVE-TODOLIST', id: todolistId} as const)
export const addTodolistAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (todolistId: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', title: title, id: todolistId} as const)
export const changeTodolistFilterAC = (todolistId: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', filter: filter, id: todolistId} as const)
export const setTodolistsAC = (todolists: TodolistType[]) =>
    ({type: 'SET-TODOLISTS', todolists} as const)
export const changeTodolistEntityStatusAC = (todolistId: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', id: todolistId, entityStatus: entityStatus} as const)
export const clearStateAC = () => ({type: 'CLEAR-STATE'} as const)

// sagas

export function* fetchTodolistsWorkerSaga() {
    yield put(setAppStatusAC('loading'))
    try {
        const res: AxiosResponse<Array<TodolistType>> = yield call(todolistAPI.getTodolists)
        yield put(setTodolistsAC(res.data))
        yield put(setAppStatusAC('succeeded'))
    } catch (error) {
        yield handleNetworkErrorSaga(error)
    }
}

export function* addTodolistWorkerSaga(action: ReturnType<typeof createTodolist>) {
    yield put(setAppStatusAC('loading'))
    try {
        const res: AxiosResponse<CommonResponseType<{ item: TodolistType }>> = yield call(todolistAPI.createTodolist, action.title)
        if (res.data.resultCode === 0) {
            yield put(addTodolistAC(res.data.data.item))
            yield put(setAppStatusAC('succeeded'))
        } else {
            yield handleAppErrorSaga(res.data)
        }
    } catch (error) {
        yield handleNetworkErrorSaga(error)
    }
}

export function* removeTodolistWorkerSaga(action: ReturnType<typeof deleteTodolist>) {
    yield put(setAppStatusAC('loading'))
    yield put(changeTodolistEntityStatusAC(action.todolistId, 'loading'))
    try {
        const res: AxiosResponse<CommonResponseType> = yield call(todolistAPI.deleteTodolist, action.todolistId)
        if (res.data.resultCode === 0) {
            yield put(removeTodolistAC(action.todolistId))
            yield put(setAppStatusAC('succeeded'))
        } else {
            yield handleAppErrorSaga(res.data)
            yield put(changeTodolistEntityStatusAC(action.todolistId, 'failed'))
        }
    } catch (error) {
        yield handleNetworkErrorSaga(error)
    }
}

export function* changeTodoListTitleWorkerSaga(action: ReturnType<typeof renameTodolist>) {
    yield put(setAppStatusAC('loading'))
    try {
        const res: AxiosResponse<CommonResponseType> = yield call(todolistAPI.updateTodolistTitle, action.todolistId, action.title)
        if (res.data.resultCode === 0) {
            yield put(changeTodolistTitleAC(action.todolistId, action.title))
            yield put(setAppStatusAC('succeeded'))
        } else {
            yield handleAppErrorSaga(res.data)
        }
    } catch (error) {
        yield handleNetworkErrorSaga(error)
    }
}

export const fetchTodolists = () => ({type: 'TODOLISTS/FETCH-TODOLISTS'} as const)
export const createTodolist = (title: string) => ({type: 'TODOLISTS/CREATE-TODOLIST', title} as const)
export const deleteTodolist = (todolistId: string) => ({type: 'TODOLISTS/DELETE-TODOLIST', todolistId} as const)
export const renameTodolist = (todolistId: string, title: string) => ({
    type: 'TODOLISTS/RENAME-TODOLIST',
    todolistId,
    title
} as const)

// types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>
export type ClearStateActionType = ReturnType<typeof clearStateAC>
type FetchTodolistsType = ReturnType<typeof fetchTodolists>
type CreateTodolistType = ReturnType<typeof createTodolist>
type DeleteTodolistType = ReturnType<typeof deleteTodolist>
type RenameTodolistType = ReturnType<typeof renameTodolist>

export type TodolistsActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistsActionType
    | AppActionsType
    | ChangeTodolistEntityStatusActionType
    | ClearStateActionType
    | FetchTodolistsType
    | CreateTodolistType
    | DeleteTodolistType
    | RenameTodolistType

export type FilterValuesType = "all" | "active" | "completed"

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}