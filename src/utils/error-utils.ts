import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {CommonResponseType} from "../api/todolist-api";
import {put} from "redux-saga/effects";
import {AxiosError} from "axios";

export function* handleNetworkErrorSaga(error: unknown) {
    const err = error as Error | AxiosError
    yield put(setAppErrorAC(err.message ? err.message : 'Some error occurred'))
    yield put(setAppStatusAC('failed'))
}

export function* handleAppErrorSaga<T>(data: CommonResponseType<T>) {
    if (data.messages.length) {
        yield put(setAppErrorAC(data.messages[0]))
    } else {
        yield put(setAppErrorAC('Some error occurred'))
    }
    yield put(setAppStatusAC('failed'))
}