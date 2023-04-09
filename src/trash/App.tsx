import React, {useState} from 'react';
import '../app/App.css';
import {v1} from "uuid";
import AddItemForm from "../components/AddItemForm/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import TodoList from '../features/TodolistsList/Todolist/Todolist';
import {FilterValuesType, TodolistDomainType} from "../features/TodolistsList/todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType} from '../api/todolist-api';
import {TaskDomainType} from "../features/TodolistsList/tasks-reducer";
// C
// R
// U
// D

export type TasksStateType = {
    [todoListID: string]: Array<TaskDomainType>
}

const App = () => {
    // BLL:
    const todoListID_1 = v1()
    const todoListID_2 = v1()
    const todoListID_3 = v1()

    const [todoLists, setTodoLists] = useState<Array<TodolistDomainType>>([
        {id: todoListID_1, title: "What to learn", addedDate: '', order: 0, filter: "all", entityStatus: "idle"},
        {id: todoListID_2, title: "What to buy", addedDate: '', order: 0, filter: "all", entityStatus: "idle"},
        {id: todoListID_3, title: "What to read", addedDate: '', order: 0, filter: "all", entityStatus: "idle"},
    ])
    const [tasks, setTasks] = useState<TasksStateType>({
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
                id: v1(),
                title: "Understanding Redux", status: TaskStatuses.New, todoListId: todoListID_3,
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
        // const tasksFromTodoList = tasks[todoListID]
        // const filteredTasks = tasksFromTodoList.filter(t => t.id !== taskID)
        // const copyTasks = {...tasks}
        // copyTasks[todoListID] = filteredTasks
        // setTasks(copyTasks)
        setTasks({
            ...tasks,
            [todoListID]: tasks[todoListID].filter(t => t.id !== taskID)
        })
    }

    const addTask = (title: string, todoListID: string) => {
        const newTask: TaskType = {
            id: v1(), title, status: TaskStatuses.New, todoListId: todoListID, description: '',
            completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
        }
        // const tasksFromTodoList = tasks[todoListID]
        // const upDatedTasks = [newTask, ...tasksFromTodoList]
        // const copyTasks = {...tasks}
        // copyTasks[todoListID] = upDatedTasks
        // setTasks(copyTasks)

        setTasks({...tasks, [todoListID]: [{...newTask, entityStatus: 'idle'}, ...tasks[todoListID]]})
    }

    const changeTaskStatus = (taskID: string, status: TaskStatuses, todoListID: string) => {
        // const tasksFromTodoList = tasks[todoListID]
        // const upDatedTasks = tasksFromTodoList.map(t => t.id === taskID ? {...t, isDone}: t)
        // const copyTasks = {...tasks}
        // copyTasks[todoListID] = upDatedTasks
        // setTasks(copyTasks)
        setTasks({
            ...tasks,
            [todoListID]: tasks[todoListID].map(t => t.id === taskID ? {
                ...t,
                status
            } : t)
        })
    }

    const changeTaskTitle = (taskID: string, title: string, todoListID: string) => {
        setTasks({
            ...tasks,
            [todoListID]: tasks[todoListID].map(t => t.id === taskID ? {
                ...t,
                title
            } : t)
        })
    }

    const removeTodoList = (todoListID: string) => {
        setTodoLists(todoLists.filter(tl => tl.id !== todoListID))
        delete tasks[todoListID]
    }

    const addTodoList = (title: string) => {
        const newTodoListID = v1()
        const newTodoList: TodolistDomainType = {
            id: newTodoListID, title, addedDate: '', order: 0, filter: "all", entityStatus: "idle"
        }
        setTodoLists([...todoLists, newTodoList])
        setTasks({...tasks, [newTodoListID]: []})
    }

    const changeTodoListTitle = (title: string, todoListID: string) => {
        const upDatedTodoLists = todoLists.map(tl => tl.id === todoListID
            ? {...tl, title}
            : tl)
        setTodoLists(upDatedTodoLists)
    }

    const changeTodoListFilter = (filter: FilterValuesType, todoListID: string) => {
        const upDatedTodoLists = todoLists.map(tl => tl.id === todoListID
            ? {...tl, filter: filter}
            : tl)
        setTodoLists(upDatedTodoLists)
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

export default App;
