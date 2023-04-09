import {Dispatch} from "redux"
import {authAPI} from "../api/todolist-api"
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleAppError, handleNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios";

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

// TC

export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleAppError(dispatch, res.data)
            }
        })
        .catch((error: AxiosError) => {
            handleNetworkError(dispatch, error.message)
        })
        .finally(() => {
            dispatch(setAppIsInitializedAC(true))
        })
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = typeof initialState

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
type SetAppIsInitializedActionType = ReturnType<typeof setAppIsInitializedAC>
export type AppActionsType = SetAppStatusActionType | SetAppErrorActionType | SetAppIsInitializedActionType