import React, {useCallback, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {
    addTodolistAC,
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodoListTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC
} from "./todolists-reducer";
import {addTaskTC, removeTaskTC, updateTaskTC} from "./tasks-reducer";
import {TaskStatuses} from "../../api/todolist-api";
import {Grid, Paper} from "@material-ui/core";
import AddItemForm from "../../components/AddItemForm/AddItemForm";
import TodoList from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";

type TodolistsListPropsType = {
    demo?: boolean
}

const TodolistsList: React.FC<TodolistsListPropsType> = ({demo = false}) => {
    // const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    // const todoLists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todoLists)
    // const {tasks, todoLists} = useSelector<AppRootStateType, AppRootStateType>(state => state)
    const {tasks, todoLists} = useAppSelector(state => state)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    // const dispatch = useDispatch()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        dispatch(fetchTodolistsTC())
    }, [])

    const removeTask = useCallback((taskID: string, todoListID: string) => {
        dispatch(removeTaskTC(todoListID, taskID))
    }, [dispatch, removeTaskTC])

    const addTask = useCallback((title: string, todoListID: string) => {
        dispatch(addTaskTC(todoListID, title))
    }, [dispatch, addTaskTC])

    const changeTaskStatus = useCallback((taskID: string, status: TaskStatuses, todoListID: string) => {
        dispatch(updateTaskTC(todoListID, taskID, {status}))
    }, [dispatch, updateTaskTC])

    const changeTaskTitle = useCallback((taskID: string, title: string, todoListID: string) => {
        dispatch(updateTaskTC(todoListID, taskID, {title}))
    }, [dispatch, updateTaskTC])

    const removeTodoList = useCallback((todoListID: string) => {
        dispatch(removeTodolistTC(todoListID))
    }, [dispatch, removeTodolistTC])

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch, addTodolistAC])

    const changeTodoListTitle = useCallback((title: string, todoListID: string) => {
        dispatch(changeTodoListTitleTC(todoListID, title))
    }, [dispatch, changeTodoListTitleTC])

    const changeTodoListFilter = useCallback((filter: FilterValuesType, todoListID: string) => {
        dispatch(changeTodolistFilterAC(todoListID, filter))
    }, [dispatch, changeTodolistFilterAC])

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