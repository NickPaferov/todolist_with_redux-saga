import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import thunk, {ThunkDispatch} from "redux-thunk";
import {TasksActionsType, tasksReducer} from "../features/TodolistsList/tasks-reducer";
import {TodolistsActionsType, todolistsReducer} from "../features/TodolistsList/todolists-reducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/Login/auth-reducer";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunk))

/*store.subscribe(()=>{
    const state = store.getState()
    console.log(state)
})*/

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>
// export type AppRootStateType = ReturnType<typeof store.getState>

type AppActionsType = TasksActionsType | TodolistsActionsType
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AppActionsType>
// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>

// hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// type DispatchType = ThunkDispatch<AppRootStateType, unknown, AnyAction>
// export const useAppDispatch = () => useDispatch<DispatchType>()

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
