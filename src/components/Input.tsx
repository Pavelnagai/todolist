import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Button, TextField} from "@mui/material";

type typeProps = {
    callback: (title: string) => void
}

const Input = (props: typeProps) => {
    let [title, setTitle] = useState("")
    let [error, setError] = useState(false)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(false);
        if (e.charCode === 13) {
            addTask();
        }
    }
    const addTask = () => {
        let newTitle = title.trim();
        if (newTitle !== "") {
            props.callback(newTitle);
            setTitle("");
        } else {
            setError(true);
        }
    }

    return (
        <div>
            {/*<input*/}
            {/*    value={title}*/}
            {/*    onChange={onChangeHandler}*/}
            {/*    onKeyPress={onKeyPressHandler}*/}
            {/*    className={error ? "error" : ""}*/}
            {/*/>*/}
            <TextField id="outlined-basic"
                // label="Title is required"
                       label={error ? "Title is required" : ''}
                       error={error}
                       variant="outlined"
                       value={title}
                       size="small"
                       onChange={onChangeHandler}
                       onKeyPress={onKeyPressHandler}
                       className={error ? "error" : ""}/>
            {/*<button onClick={addTask}>+</button>*/}
            <Button style={{maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'}}
                    variant="contained" onClick={addTask} disabled={error}>+</Button>
            {/*{error && <div className="error-message">{error}</div>}*/}
        </div>
    );
};

export default Input;


//-----------------------------------------------------------------------------------------------


// import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
// import {Button, TextField} from "@mui/material";
//
// type typeProps = {
//     callback: (title: string) => void
// }
//
// const Input = (props: typeProps) => {
//     let [title, setTitle] = useState("")
//     let [error, setError] = useState<string | null>(null)
//
//     const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
//         setTitle(e.currentTarget.value)
//     }
//
//     const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
//         setError(null);
//         if (e.charCode === 13) {
//             addTask();
//         }
//     }
//     const addTask = () => {
//         let newTitle = title.trim();
//         if (newTitle !== "") {
//             props.callback(newTitle);
//             // props.callback(newTitle, props.id);
//             setTitle("");
//         } else {
//             setError("Title is required");
//         }
//     }
//
//     return (
//         <div>
//             {/*<input*/}
//             {/*    value={title}*/}
//             {/*    onChange={onChangeHandler}*/}
//             {/*    onKeyPress={onKeyPressHandler}*/}
//             {/*    className={error ? "error" : ""}*/}
//             {/*/>*/}
//             <TextField id="outlined-basic"
//                 // label="Title is required"
//                        label={error ? "Title is required" : ''}
//                        error={!!error}
//                        variant="outlined"
//                        value={title}
//                        size="small"
//                        onChange={onChangeHandler}
//                        onKeyPress={onKeyPressHandler}
//                        className={error ? "error" : ""}/>
//             {/*<button onClick={addTask}>+</button>*/}
//             <Button style={{maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'}}
//                     variant="contained" onClick={addTask}>+</Button>
//             {/*{error && <div className="error-message">{error}</div>}*/}
//         </div>
//     );
// };
//
// export default Input;