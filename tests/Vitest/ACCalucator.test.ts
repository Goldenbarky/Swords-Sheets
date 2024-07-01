import { expect, test } from 'vitest'
import { createNewCharacter, getAbilityModifier, setCharacter , calcAC} from '../../src/lib/GenericFunctions'

const updateCharacter = (character:CharacterSheet) => {
    setCharacter({data:character, name:"Dex", id:`acTesting`});
}

// @ts-expect-error
let character:CharacterSheet = createNewCharacter("Rogue", 20);
updateCharacter(character);

test('Character Setup Properly - High Dex', () => {
    character.Stats.Ability_Scores.Dexterity = 20;

    updateCharacter(character);

    expect(getAbilityModifier("Dexterity")).toBe(5);
    expect(character.Equipment.Armor.Base).toBe(10);
    expect(character.Equipment.Armor.Limit).toBe("");
    expect(character.Equipment.Armor.Bonus).toBe(0);
    expect(character.Equipment.Shields.length).toBe(0);
    expect(character.Equipment.Armor.Ability).toBe("Dexterity");
})

test('Character Setup Properly - Low Dex', () => {
    character.Stats.Ability_Scores.Dexterity = 6;
    
    updateCharacter(character);

    expect(getAbilityModifier("Dexterity")).toBe(-2);
    expect(character.Equipment.Armor.Base).toBe(10);
    expect(character.Equipment.Armor.Limit).toBe("");
    expect(character.Equipment.Armor.Bonus).toBe(0);
    expect(character.Equipment.Shields.length).toBe(0);
    expect(character.Equipment.Armor.Ability).toBe("Dexterity");
})

test('Unarmored AC - High Dex', () => {
    character.Stats.Ability_Scores.Dexterity = 20;
    
    updateCharacter(character);

    expect(calcAC()).toBe(15);
})

test('Unarmored AC - Low Dex', () => {
    character.Stats.Ability_Scores.Dexterity = 6;

    updateCharacter(character);

    expect(calcAC()).toBe(8);
})

test('Light Armor AC - High Dex', () => {
    character.Stats.Ability_Scores.Dexterity = 20;

    character.Equipment.Armor.Base = 12;

    updateCharacter(character);

    expect(calcAC()).toBe(17);
})

test('Light Armor AC - Low Dex', () => {
    character.Stats.Ability_Scores.Dexterity = 6;

    character.Equipment.Armor.Base = 13;

    updateCharacter(character);

    expect(calcAC()).toBe(11);
})

test('Medium Armor AC - High Dex', () => {
    character.Stats.Ability_Scores.Dexterity = 20;

    character.Equipment.Armor.Base = 15;
    character.Equipment.Armor.Limit = 2;

    updateCharacter(character);

    expect(calcAC()).toBe(17);
})

test('Medium Armor AC - Low Dex', () => {
    character.Stats.Ability_Scores.Dexterity = 6;

    character.Equipment.Armor.Base = 15;
    character.Equipment.Armor.Limit = 2;

    updateCharacter(character);

    expect(calcAC()).toBe(13);
})

test('Heavy Armor AC - High Dex', () => {
    character.Stats.Ability_Scores.Dexterity = 20;
    
    character.Equipment.Armor.Limit = 0;
    character.Equipment.Armor.Base = 18;

    updateCharacter(character);

    expect(calcAC()).toBe(18);
})

test('Heavy Armor AC - Low Dex', () => {
    character.Stats.Ability_Scores.Dexterity = 6;
    
    character.Equipment.Armor.Limit = 0;
    character.Equipment.Armor.Base = 18;

    updateCharacter(character);

    expect(calcAC()).toBe(18);
})