import React, {useEffect} from 'react';
import './App.css';
import {Menu} from '@material-ui/icons';
import TodolistList from "../components/TodolistList/TodolistList";
import {AppRootStateType, useAppSelector} from "../state/store/store";
import {initializeAppTC, RequestStatusType} from "../state/app/app-reducer";
import AppBar from '@material-ui/core/AppBar/AppBar';
import Container from '@material-ui/core/Container/Container';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Login} from '../components/login/Login';
import Error404 from "../components/Error404/Error404";
import {useDispatch, useSelector} from "react-redux";
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import {logoutTC} from "../state/auth/auth-reducer";


function App() {
    const status = useAppSelector<RequestStatusType>(state => state.appReducer.status)
    const isInitialized = useAppSelector<boolean>(state => state.appReducer.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.authReducer.isLoggedIn)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])
    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }
    const logoutHandler = () => {
        dispatch(logoutTC())
    }
    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color="secondary"/>}
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodolistList/>}/>
                    <Route path={'login'} element={<Login/>}/>
                    <Route path={'404'} element={<Error404/>}/>
                    <Route path={'*'} element={<Navigate to='404'/>}/>
                </Routes>
            </Container>
            <ErrorSnackbar/>
        </div>
    );
}

export default App;
