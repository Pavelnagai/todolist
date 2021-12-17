import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Icon} from "@mui/material";
import {green} from "@mui/material/colors";
import AddTaskIcon from '@mui/icons-material/AddTask';

type typeProps = {
    callback: (title: string) => void
}

const Input = (props: typeProps) => {
    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if (e.charCode === 13) {
            addTask();
        }
    }
    const addTask = () => {
        let newTitle = title.trim();
        if (newTitle !== "") {
            props.callback(newTitle);
            // props.callback(newTitle, props.id);
            setTitle("");
        } else {
            setError("Title is required");
        }
    }

    return (
        <div>
            <input
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                className={error ? "error" : ""}
            />
            {/*<TextField*/}
            {/*    id="filled-basic"  variant="filled"*/}
            {/*           value={title}*/}
            {/*           onChange={onChangeHandler}*/}
            {/*           onKeyPress={onKeyPressHandler}*/}
            {/*           className={error ? "error" : ""}/>*/}

            {/*<button onClick={addTask}>+</button>*/}

            <Icon color="primary" onClick={addTask}>
                <AddTaskIcon/>
            </Icon>
            {/*<Icon*/}
            {/*    baseClassName="fas"*/}
            {/*    className="fa-plus-circle"*/}
            {/*    sx={{color: green[500]}}*/}
            {/*/>*/}

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Input;