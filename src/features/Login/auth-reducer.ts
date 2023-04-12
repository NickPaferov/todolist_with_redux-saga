import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer'
import {authAPI, CommonResponseType, LoginParamsType} from "../../api/todolist-api";
import {AxiosResponse} from "axios";
import {clearStateAC, ClearStateActionType} from "../TodolistsList/todolists-reducer";
import {call, put} from 'redux-saga/effects';
import {handleAppErrorSaga, handleNetworkErrorSaga} from "../../utils/error-utils";

const initialState = {
    isLoggedIn: false
}
export type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// AC
export const setIsLoggedInAC = (value: boolean) => ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// sagas

export function* loginWorkerSaga(action: ReturnType<typeof login>) {
    yield put(setAppStatusAC('loading'))
    try {
        const res: AxiosResponse<CommonResponseType> = yield call(authAPI.login, action.data)
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC(true))
            yield put(setAppStatusAC('succeeded'))
        } else {
            yield handleAppErrorSaga(res.data)
        }
    } catch (error) {
        yield handleNetworkErrorSaga(error)
    }
}

export function* logoutWorkerSaga() {
    yield put(setAppStatusAC('loading'))
    try {
        const res: AxiosResponse<CommonResponseType> = yield call(authAPI.logout)
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC(false))
            yield put(clearStateAC())
            yield put(setAppStatusAC('succeeded'))
        } else {
            yield handleAppErrorSaga(res.data)
        }
    } catch (error) {
        yield handleNetworkErrorSaga(error)
    }
}

export const login = (data: LoginParamsType) => ({type: 'AUTH/LOGIN', data} as const)
export const logout = () => ({type: 'AUTH/LOGOUT'} as const)

// types
type SetIsLoggedInActionType = ReturnType<typeof setIsLoggedInAC>
type LoginType = ReturnType<typeof login>
type LogoutType = ReturnType<typeof logout>

export type AuthActionsType =
    | SetIsLoggedInActionType
    | SetAppStatusActionType
    | SetAppErrorActionType
    | ClearStateActionType
    | LoginType
    | LogoutType



