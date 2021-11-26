import React from "react";

export type ButtonPropsType = {
    name: string
    callback: () => void
}

export function Button (props: ButtonPropsType) {
    return (
        <button onClick={()=>{props.callback()}}>{props.name}</button>
    )
}