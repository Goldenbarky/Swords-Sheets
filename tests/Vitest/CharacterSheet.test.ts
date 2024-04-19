import { expect, test } from 'vitest'
import { createNewCharacter, getAbilityModifier, setCharacter } from '../../src/lib/GenericFunctions'

test('Setting a character', () => {
    // @ts-expect-error
    let character:CharacterSheet = createNewCharacter("Cleric", 1);

    setCharacter({data:character, name:"Greg", id:"ab123"});

    expect(getAbilityModifier("Strength")).toBe(0);
})