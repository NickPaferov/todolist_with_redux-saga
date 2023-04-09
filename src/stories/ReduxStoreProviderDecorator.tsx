import {Provider} from "react-redux";
import {AppRootStateType} from "../app/store";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {tasksReducer} from "../features/TodolistsList/tasks-reducer";
import {todolistsReducer} from "../features/TodolistsList/todolists-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";
import {appReducer} from "../app/app-reducer";
import thunk from "redux-thunk";
import {authReducer} from "../features/Login/auth-reducer";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState: AppRootStateType = {
    todoLists: [
        {id: "todolistId1", title: "What to learn", addedDate: '', order: 0, filter: "all", entityStatus: "idle"},
        {id: "todolistId2", title: "What to buy", addedDate: '', order: 0, filter: "all", entityStatus: "loading"}
    ],
    tasks: {
        ["todolistId1"]: [
            {
                id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
                completed: true, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
            {
                id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
                completed: true, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            }
        ],
        ["todolistId2"]: [
            {
                id: v1(), title: "Milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
                completed: true, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
            {
                id: v1(), title: "React Book", status: TaskStatuses.Completed, todoListId: "todolistId2",
                description: '', completed: true, startDate: '', deadline: '', addedDate: '', order: 0,
                priority: TaskPriorities.Low, entityStatus: 'idle'
            }
        ]
    },
    app: {
        status: "idle",
        error: null,
        isInitialized: false
    },
    auth: {
        isLoggedIn: false
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState, applyMiddleware(thunk));

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}