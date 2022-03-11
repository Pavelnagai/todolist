export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.payload.status}
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
export  type SetAppStatusType = ReturnType<typeof setAppStatus>
type ActionsType = SetAppStatusType