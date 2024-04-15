import { expect, test } from 'vitest'
import { bonusToString } from '../../src/lib/GenericFunctions'

test('bonusToString tests', () => {
    expect(bonusToString(5)).toBe("+5");
})

test('Negative Bonus', () => {
    expect(bonusToString(-10)).toBe("-10");
})

test('Bonus of 0', () => {
    expect(bonusToString(0)).toBe("+0");
})

test('Not a number', () => {
    expect(bonusToString(NaN)).toBe("NaN");
})