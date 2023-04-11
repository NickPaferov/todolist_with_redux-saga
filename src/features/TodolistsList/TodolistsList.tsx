import React, {useCallback, useEffect} from "react";
import {useAppSelector} from "../../app/store";
import {
    changeTodolistFilterAC,
    createTodolist,
    deleteTodolist,
    fetchTodolists,
    FilterValuesType,
    renameTodolist,
} from "./todolists-reducer";
import {createTask, deleteTask, updateTask} from "./tasks-reducer";
import {TaskStatuses} from "../../api/todolist-api";
import {Grid, Paper} from "@material-ui/core";
import AddItemForm from "../../components/AddItemForm/AddItemForm";
import TodoList from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {useDispatch} from "react-redux";

type TodolistsListPropsType = {
    demo?: boolean
}

const TodolistsList: React.FC<TodolistsListPropsType> = ({demo = false}) => {

    const dispatch = useDispatch()

    // const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    // const todoLists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todoLists)
    // const {tasks, todoLists} = useSelector<AppRootStateType, AppRootStateType>(state => state)
    const {tasks, todoLists} = useAppSelector(state => state)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)


    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        dispatch(fetchTodolists())
    }, [dispatch, demo, isLoggedIn])

    const removeTask = useCallback((taskID: string, todoListID: string) => {
        dispatch(deleteTask(todoListID, taskID))
    }, [dispatch])

    const addTask = useCallback((title: string, todoListID: string) => {
        dispatch(createTask(todoListID, title))
    }, [dispatch])

    const changeTaskStatus = useCallback((taskID: string, status: TaskStatuses, todoListID: string) => {
        dispatch(updateTask(todoListID, taskID, {status}))
    }, [dispatch])

    const changeTaskTitle = useCallback((taskID: string, title: string, todoListID: string) => {
        dispatch(updateTask(todoListID, taskID, {title}))
    }, [dispatch])

    const removeTodoList = useCallback((todoListID: string) => {
        dispatch(deleteTodolist(todoListID))
    }, [dispatch])

    const addTodoList = useCallback((title: string) => {
        dispatch(createTodolist(title))
    }, [dispatch])

    const changeTodoListTitle = useCallback((title: string, todoListID: string) => {
        dispatch(renameTodolist(todoListID, title))
    }, [dispatch])

    const changeTodoListFilter = useCallback((filter: FilterValuesType, todoListID: string) => {
        dispatch(changeTodolistFilterAC(todoListID, filter))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }


    return <>
        <Grid container style={{padding: "25px 0"}} justifyContent="center">
            <AddItemForm addItem={addTodoList}/>
        </Grid>
        <Grid container spacing={5} justifyContent="center">
            {todoLists.map(tl => {
                let allTodolistTasks = tasks[tl.id]
                return (
                    <Grid item key={tl.id}>
                        <Paper elevation={5} style={{padding: "20px"}}>
                            <TodoList
                                todoListID={tl.id}
                                title={tl.title}
                                tasks={allTodolistTasks}
                                filter={tl.filter}
                                entityStatus={tl.entityStatus}
                                removeTask={removeTask}
                                changeFilter={changeTodoListFilter}
                                addTask={addTask}
                                removeTodoList={removeTodoList}
                                changeTaskStatus={changeTaskStatus}
                                changeTaskTitle={changeTaskTitle}
                                changeTodoListTitle={changeTodoListTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                )
            })}
        </Grid>
    </>
}

export default TodolistsList;