import {authAPI, CommonResponseType} from "../api/todolist-api"
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {AxiosError, AxiosResponse} from "axios";
import {call, put} from "redux-saga/effects";

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case "APP/SET-IS-INITIALIZED":
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

// AC
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: null | string) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppIsInitializedAC = (isInitialized: boolean) =>
    ({type: 'APP/SET-IS-INITIALIZED', isInitialized} as const)


// saga

export function* initializeAppWorkerSaga() {
    yield put(setAppStatusAC('loading'))
    try {
        const res: AxiosResponse<CommonResponseType> = yield call(authAPI.me)
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC(true))
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
    } finally {
        yield put(setAppIsInitializedAC(true))
    }
}

export const initializeApp = () => ({type: 'APP/INITIALIZE-APP'} as const)

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = typeof initialState

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
type SetAppIsInitializedActionType = ReturnType<typeof setAppIsInitializedAC>
type InitializeAppType = ReturnType<typeof initializeApp>

export type AppActionsType =
    | SetAppStatusActionType
    | SetAppErrorActionType
    | SetAppIsInitializedActionType
    | InitializeAppType