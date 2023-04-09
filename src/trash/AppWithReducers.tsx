import React, {useReducer} from 'react';
import '../app/App.css';
import {v1} from "uuid";
import AddItemForm from "../components/AddItemForm/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import TodoList from '../features/TodolistsList/Todolist/Todolist';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    FilterValuesType,
    removeTodolistAC,
    TodolistDomainType,
    todolistsReducer
} from "../features/TodolistsList/todolists-reducer";
import {addTaskAC, removeTaskAC, tasksReducer, updateTaskAC} from "../features/TodolistsList/tasks-reducer";
import {TaskPriorities, TaskStatuses} from '../api/todolist-api';
// C
// R
// U
// D

const AppWithReducers = () => {
    // BLL:
    const todoListID_1 = v1()
    const todoListID_2 = v1()
    const todoListID_3 = v1()

    const [todoLists, dispatchToTodoLists] = useReducer(todolistsReducer, [
        {id: todoListID_1, title: "What to learn", addedDate: '', order: 0, filter: "all", entityStatus: "idle"},
        {id: todoListID_2, title: "What to buy", addedDate: '', order: 0, filter: "all", entityStatus: "idle"},
        {id: todoListID_3, title: "What to read", addedDate: '', order: 0, filter: "all", entityStatus: "idle"},
    ])

    const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todoListID_1]: [
            {
                id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: todoListID_1, description: '',
                completed: true, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
            {
                id: v1(), title: "JS/ES6", status: TaskStatuses.Completed, todoListId: todoListID_1, description: '',
                completed: true, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
            {
                id: v1(), title: "REACT", status: TaskStatuses.Completed, todoListId: todoListID_1, description: '',
                completed: true, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
        ],
        [todoListID_2]: [
            {
                id: v1(), title: "MILK", status: TaskStatuses.Completed, todoListId: todoListID_2, description: '',
                completed: true, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
            {
                id: v1(), title: "BREAD", status: TaskStatuses.New, todoListId: todoListID_2, description: '',
                completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
            {
                id: v1(), title: "MEAT", status: TaskStatuses.Completed, todoListId: todoListID_2, description: '',
                completed: true, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
        ],
        [todoListID_3]: [
            {
                id: v1(), title: "You don't know JS", status: TaskStatuses.Completed, todoListId: todoListID_3,
                description: '', completed: true, startDate: '', deadline: '', addedDate: '', order: 0,
                priority: TaskPriorities.Low, entityStatus: 'idle'
            },
            {
                id: v1(), title: "Understanding Redux", status: TaskStatuses.New, todoListId: todoListID_3,
                description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0,
                priority: TaskPriorities.Low, entityStatus: 'idle'
            },
            {
                id: v1(), title: "How to learn React", status: TaskStatuses.New, todoListId: todoListID_3,
                description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0,
                priority: TaskPriorities.Low, entityStatus: 'idle'
            },
        ],
    })

    const removeTask = (taskID: string, todoListID: string) => {
        // let action = removeTaskAC(taskID, todoListID)
        // dispatchToTasks(action)
        dispatchToTasks(removeTaskAC(taskID, todoListID))
    }

    const addTask = (title: string, todoListID: string) => {
        let action = addTaskAC({
            id: "some id",
            startDate: "",
            deadline: "",
            completed: false,
            title: title,
            status: TaskStatuses.New,
            todoListId: todoListID,
            description: "",
            order: 0,
            priority: 0,
            addedDate: ""
        })
        dispatchToTasks(action)
    }

    const changeTaskStatus = (taskID: string, status: TaskStatuses, todoListID: string) => {
        // let action = changeTaskStatusAC(taskID, isDone, todoListID)
        // dispatchToTasks(action)
        dispatchToTasks(updateTaskAC(taskID, {status}, todoListID))
    }

    const changeTaskTitle = (taskID: string, title: string, todoListID: string) => {
        // let action = changeTaskTitleAC(taskID, title, todoListID)
        // dispatchToTasks(action)
        dispatchToTasks(updateTaskAC(taskID, {title}, todoListID))
    }

    const removeTodoList = (todoListID: string) => {
        let action = removeTodolistAC(todoListID)
        dispatchToTodoLists(action)
        dispatchToTasks(action)
    }

    const addTodoList = (title: string) => {
        let action = addTodolistAC({
            id: v1(),
            title: title,
            order: 0,
            addedDate: ""
        })
        dispatchToTodoLists(action)
        dispatchToTasks(action)
    }

    const changeTodoListTitle = (title: string, todoListID: string) => {
        // let action = changeTodolistTitleAC(todoListID, title)
        // dispatchToTodoLists(action)
        dispatchToTodoLists(changeTodolistTitleAC(todoListID, title))
    }

    const changeTodoListFilter = (filter: FilterValuesType, todoListID: string) => {
        // let action = changeTodolistFilterAC(todoListID, filter)
        // dispatchToTodoLists(action)
        dispatchToTodoLists(changeTodolistFilterAC(todoListID, filter))
    }

    const getTasksForRender = (todoList: TodolistDomainType) => {
        switch (todoList.filter) {
            case "active":
                return tasks[todoList.id].filter(t => t.status === TaskStatuses.New)
            case "completed":
                return tasks[todoList.id].filter(t => t.status === TaskStatuses.Completed)
            default:
                return tasks[todoList.id]
        }
    }

    const todoListsComponents = todoLists.map(tl => {
        const tasksForRender = getTasksForRender(tl)
        return (
            <Grid item key={tl.id}>
                <Paper elevation={5} style={{padding: "20px"}}>
                    <TodoList
                        todoListID={tl.id}
                        title={tl.title}
                        tasks={tasksForRender}
                        filter={tl.filter}
                        entityStatus={tl.entityStatus}
                        removeTask={removeTask}
                        changeFilter={changeTodoListFilter}
                        addTask={addTask}
                        removeTodoList={removeTodoList}
                        changeTaskStatus={changeTaskStatus}
                        changeTaskTitle={changeTaskTitle}
                        changeTodoListTitle={changeTodoListTitle}
                    />
                </Paper>
            </Grid>
        )
    })

    // GUI:
    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolists
                    </Typography>
                    <Button color="inherit" variant="outlined">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "25px 0"}} justifyContent="center">
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={5} justifyContent="center">
                    {todoListsComponents}
                </Grid>

            </Container>
        </div>
    );
}

export default AppWithReducers;
