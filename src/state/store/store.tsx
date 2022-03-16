import {applyMiddleware, combineReducers, createStore} from "redux";
import {todolistsReducer} from "../todolists/todolists-reducer";
import {tasksReducer} from "../tasks/tasks-reducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import thunk from "redux-thunk";
import {appReducer} from "../app/app-reducer";
import {authReducer} from "../auth/auth-reducer";

export type AppRootStateType = ReturnType<typeof rootReducer>
const rootReducer = combineReducers({
    todolistsReducer,
    tasksReducer,
    appReducer,
    authReducer,
})


export const store = createStore(rootReducer,applyMiddleware(thunk))

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

//@ts-ignore
window.store = store