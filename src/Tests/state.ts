export function sum(state: number, number: number) {
    return state + number
}

export function sub(state: number, number: number) {
    return state - number
}

export function mult(state: number, number: number) {
    return state * number
}

export function div(state: number, number: number) {
    return state / number
}

export type ActionType = {
    type: 'sum' | 'sub' | 'mult' | 'div'
    payload: number
}
export const salaryReducer = (state: number, action: ActionType): number => {
    switch (action.type) {
        case "sum": {
            return state + action.payload
        }
        case "sub": {
            return state - action.payload
        }
        case "mult": {
            return state * action.payload
        }
        case "div": {
            return state / action.payload
        }
        default:
            return state
    }
}