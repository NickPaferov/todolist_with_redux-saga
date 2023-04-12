import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import {TasksActionsType, tasksReducer, tasksWatcherSaga} from "../features/TodolistsList/tasks-reducer";
import {
    TodolistsActionsType,
    todolistsReducer,
    todolistsWatcherSaga
} from "../features/TodolistsList/todolists-reducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {AppActionsType, appReducer, appWatcherSaga} from "./app-reducer";
import {AuthActionsType, authReducer, authWatcherSaga} from "../features/Login/auth-reducer";
import createSagaMiddleware from "redux-saga";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

// создаём sagaMiddleware
const sagaMiddleware = createSagaMiddleware()

// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))

//запускаем saga
sagaMiddleware.run(rootWatcher)

function* rootWatcher() {
    yield* appWatcherSaga()
    yield* authWatcherSaga()
    yield* todolistsWatcherSaga()
    yield* tasksWatcherSaga()
}

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>
// export type AppRootStateType = ReturnType<typeof store.getState>

export type AppRootActionsType = AppActionsType | AuthActionsType | TasksActionsType | TodolistsActionsType

// hook
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
