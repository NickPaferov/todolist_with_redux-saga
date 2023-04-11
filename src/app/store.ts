import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import {
    addTaskWorkerSaga,
    fetchTasksWorkerSaga,
    removeTaskWorkerSaga,
    TasksActionsType,
    tasksReducer,
    updateTaskWorkerSaga
} from "../features/TodolistsList/tasks-reducer";
import {
    addTodolistWorkerSaga,
    changeTodoListTitleWorkerSaga,
    fetchTodolistsWorkerSaga,
    removeTodolistWorkerSaga,
    TodolistsActionsType,
    todolistsReducer
} from "../features/TodolistsList/todolists-reducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {AppActionsType, appReducer, initializeAppWorkerSaga} from "./app-reducer";
import {AuthActionsType, authReducer, loginWorkerSaga, logoutWorkerSaga} from "../features/Login/auth-reducer";
import createSagaMiddleware from "redux-saga";
import {takeEvery} from "redux-saga/effects";

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
    yield takeEvery('APP/INITIALIZE-APP', initializeAppWorkerSaga)
    yield takeEvery('AUTH/LOGIN', loginWorkerSaga)
    yield takeEvery('AUTH/LOGOUT', logoutWorkerSaga)
    yield takeEvery('TODOLISTS/FETCH-TODOLISTS', fetchTodolistsWorkerSaga)
    yield takeEvery('TODOLISTS/CREATE-TODOLIST', addTodolistWorkerSaga)
    yield takeEvery('TODOLISTS/DELETE-TODOLIST', removeTodolistWorkerSaga)
    yield takeEvery('TODOLISTS/RENAME-TODOLIST', changeTodoListTitleWorkerSaga)
    yield takeEvery('TASKS/FETCH-TASKS', fetchTasksWorkerSaga)
    yield takeEvery('TASKS/CREATE-TASK', addTaskWorkerSaga)
    yield takeEvery('TASKS/DELETE-TASK', removeTaskWorkerSaga)
    yield takeEvery('TASKS/UPDATE-TASK', updateTaskWorkerSaga)
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
