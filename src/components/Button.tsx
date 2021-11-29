import React from "react";
import {FilterValuesType} from "../App";

export type ButtonPropsType = {
    name: string
    callback: () => void
    filter: FilterValuesType
}

export function Button (props: ButtonPropsType) {
    return (
        <button className={props.filter} onClick={()=>{props.callback()}}>{props.name}</button>
    )
}