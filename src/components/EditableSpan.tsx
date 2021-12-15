import React, {ChangeEvent, useState} from 'react';

type propsType = {
    title: string
    callBackForEditableSpan:(LocalTitle:string)=>void
}

const EditableSpan = (props: propsType) => {
    const [edit, setEdit] = useState(false)
    let [LocalTitle, setLocalTitle] = useState(props.title)

    const onDoubleClickHandlerTRUE=()=>{
        setEdit(true)
    }

    const onBlurHandlerFALSE=()=>{
        setEdit(false)
        props.callBackForEditableSpan(LocalTitle)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setLocalTitle(e.currentTarget.value)
    }

    return (
        edit
            ? <input value={LocalTitle} onChange={onChangeHandler} onBlur={onBlurHandlerFALSE} autoFocus />
            : <span onDoubleClick={onDoubleClickHandlerTRUE}>{props.title}</span>
    );
};

export default EditableSpan;