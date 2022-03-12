export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as string | null,
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.payload.status}
        case "APP/SET-ERROR":
            return {...state, error: action.payload.error}
        default:
            return state
    }
}

export const setAppStatus = (status: RequestStatusType) => ({
    type: 'APP/SET-STATUS',
    payload: {
        status
    }
} as const)

export const setError = (error: string | null) => ({
    type: 'APP/SET-ERROR',
    payload: {
        error
    }
} as const)


export type SetErrorType = ReturnType<typeof setError>
export  type SetAppStatusType = ReturnType<typeof setAppStatus>
export type AppActionsType = SetAppStatusType |SetErrorType