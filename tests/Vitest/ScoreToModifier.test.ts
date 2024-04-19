import { expect, test } from 'vitest'
import { scoreToModifier } from '../../src/lib/GenericFunctions'

test('+0 modifier', () => {
    expect(scoreToModifier(10)).toBe(0);
})

test('+6 modifier', () => {
    expect(scoreToModifier(22)).toBe(6);
})

test('Odd score', () => {
    expect(scoreToModifier(13)).toBe(1);
})

test('-2 modifier', () => {
    expect(scoreToModifier(7)).toBe(-2);
})