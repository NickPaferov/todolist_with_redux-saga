import {Dispatch} from "redux";
import {AppActionsType, setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {CommonResponseType} from "../api/todolist-api";

export const handleNetworkError = (dispatch: Dispatch<AppActionsType>, message: string) => {
    dispatch(setAppErrorAC(message))
    dispatch(setAppStatusAC('failed'))
}

export const handleAppError = <T>(dispatch: Dispatch<AppActionsType>, data: CommonResponseType<T>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}