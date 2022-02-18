import {combineReducers, createStore} from "redux";
import {todolistsReducer} from "./todolists-reducer";
import {tasksReducer} from "./tasks-reducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";

export type AppRootStateType = ReturnType<typeof rootReducer>
const rootReducer = combineReducers({
    todolistsReducer,
    tasksReducer,
})


export const store = createStore(rootReducer)

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

//@ts-ignore
window.store = store