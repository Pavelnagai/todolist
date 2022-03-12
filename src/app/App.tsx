import React from 'react';
import './App.css';
import {Menu} from '@material-ui/icons';
import TodolistList from "../components/TodolistList/TodolistList";
import {useAppSelector} from "../state/store/store";
import {RequestStatusType} from "../state/app/app-reducer";
import AppBar from '@material-ui/core/AppBar/AppBar';
import Container from '@material-ui/core/Container/Container';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import { ErrorSnackbar } from '../components/ErrorSnackbar/ErrorSnackbar';


function App() {
    const status = useAppSelector<RequestStatusType>(state => state.appReducer.status)
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
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color="secondary"/>}
            <Container fixed>
                <TodolistList/>
            </Container>
           <ErrorSnackbar/>
        </div>
    );
}

export default App;
