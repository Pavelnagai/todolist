import {ActionType, div, mult, salaryReducer, sub, sum} from "./state";
import exp from "constants";

test('sum', () => {
    const a: number = 570
    const b: number = 330
    const result = sum(a, b)

    expect(result).toBe(900)
})
test('sub', () => {
    const a: number = 570
    const b: number = 330
    const result = sub(a, b)
    expect(result).toBe(240)
})
test('mult', () => {
    const a: number = 570
    const b: number = 3
    const result = mult(a, b)
    expect(result).toBe(1710)
})
test('sub', () => {
    const a: number = 600
    const b: number = 3
    const result = div(a, b)
    expect(result).toBe(200)
})
test('salaryReducer', () => {
    const sumAction: ActionType = {type: 'sum', payload: 330}
    expect(salaryReducer(570, sumAction )).toBe(900)
    const subAction: ActionType = {type: 'sub', payload: 330}
    expect(salaryReducer(570, subAction )).toBe(240)
    const multAction: ActionType = {type: 'mult', payload: 3}
    expect(salaryReducer(570, multAction )).toBe(1710)
    const divAction: ActionType = {type: 'div', payload: 3}
    expect(salaryReducer(600, divAction )).toBe(200)
})

