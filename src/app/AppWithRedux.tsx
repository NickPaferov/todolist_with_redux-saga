import React, {useCallback, useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import TodolistsList from '../features/TodolistsList/TodolistsList';
import {useAppSelector} from "./store";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from 'react-router-dom';
import {initializeApp} from "./app-reducer";
import {logout} from "../features/Login/auth-reducer";
import {useDispatch} from "react-redux";

type AppWithReduxPropsType = {
    demo?: boolean
}

const AppWithRedux: React.FC<AppWithReduxPropsType> = ({demo = false}) => {

    const dispatch = useDispatch()

    // const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const status = useAppSelector(state => state.app.status)
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    useEffect(() => {
        dispatch(initializeApp())
    }, [dispatch])

    const logoutHandler = useCallback(() => {
        dispatch(logout())
    }, [dispatch])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

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
                    {isLoggedIn && <Button color="inherit" variant="outlined" onClick={logoutHandler}>Log out</Button>}
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color="secondary"/>}
            <Container fixed>
                <Routes>
                    <Route path="/" element={<TodolistsList demo={demo}/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/404" element={<h1 style={{textAlign: "center"}}>404 Page not found</h1>}/>
                    <Route path="/todolist_with_redux-saga" element={<Navigate to="/"/>}/>
                    <Route path="*" element={<Navigate to="/404"/>}/>
                </Routes>
            </Container>
            <ErrorSnackbar/>
        </div>
    );
}

export default AppWithRedux;
