import type { SupabaseClient } from "@supabase/supabase-js";
import { theme } from "./Theme";
import { writable } from "svelte/store";
import { PUBLIC_SITE_URL } from "$env/static/public";
import type { User } from '@supabase/gotrue-js';
import merge from 'deepmerge-json';
import { Calculation } from "./Components/Classes/DataClasses";

import CharacterTemplate from "$lib/Data/CharacterTemplate.json";
import ShieldTemplate from "$lib/Data/ShieldTemplate.json";
import WeaponTemplate from "$lib/Data/WeaponTemplate.json";
import MagicItemTemplate from "$lib/Data/MagicItemTemplate.json";

let supabase: SupabaseClient | undefined;
export let supabaseObject = (supa?: SupabaseClient) => {
    if (supa) supabase = supa;
    return supabase;
};

export let user = writable<User | null>(null);

export let savingPromise = writable<boolean>(false);

let character_sheet: CharacterSheet | null;
let character_id: string | null;
let character: { name: any; data?: CharacterSheet; id?: string; };

let colors: { primary: string; secondary: string; background: string; background_hover: string; text: string; border: string; };
theme.subscribe(a => colors = a);

export const bonusToString = (bonus: number) => {
    return `${bonus >= 0 ? "+" : ""}${bonus.toString()}`;
};

export const scoreToModifier = (score: number) => {
    let modifier = Math.floor(score / 2) - 5;
    return modifier;
};

export const getPB = () => {
    if (!character_sheet) return 0;
    let level = Number(character_sheet.Level);

    return Math.floor((level + 3) / 4) + 1;
}

export const getAbilityModifier = (ability: keyof AbilityScoreType) => {
    if (!character_sheet) return 0;

    return scoreToModifier(character_sheet.Stats.Ability_Scores[ability]);
}

export let abilities = [
    "Strength",
    "Dexterity",
    "Constitution",
    "Intelligence",
    "Wisdom",
    "Charisma",
] as (keyof AbilityScoreType)[];

export let skills = [
    "Acrobatics",
    "Animal Handling",
    "Arcana",
    "Athletics",
    "Deception",
    "History",
    "Insight",
    "Intimidation",
    "Investigation",
    "Medicine",
    "Nature",
    "Perception",
    "Performance",
    "Persuasion",
    "Religion",
    "Slight of Hand",
    "Stealth",
    "Survival",
] as (keyof SkillProficiencyType)[];

export let skill_score_dictionary = {
    Acrobatics: "Dexterity",
    "Animal Handling": "Wisdom",
    Arcana: "Intelligence",
    Athletics: "Strength",
    Deception: "Charisma",
    History: "Intelligence",
    Insight: "Wisdom",
    Intimidation: "Charisma",
    Investigation: "Intelligence",
    Medicine: "Intelligence",
    Nature: "Wisdom",
    Perception: "Wisdom",
    Performance: "Charisma",
    Persuasion: "Charisma",
    Religion: "Intelligence",
    "Slight of Hand": "Dexterity",
    Stealth: "Dexterity",
    Survival: "Wisdom",
    Strength: "Strength",
    Dexterity: "Dexterity",
    Constitution: "Constitution",
};

export let passive_skills = [
    "Insight",
    "Investigation",
    "Perception",
] as (keyof SkillProficiencyType)[];

export const calcSkillBonus = (skill: keyof SkillProficiencyType, verbose:boolean = false) => {
    if (!character_sheet) return undefined;

    let proficiency = character_sheet.Stats.Proficiencies.Skills[skill];
    let score: keyof AbilityScoreType = skill_score_dictionary[skill] as keyof AbilityScoreType;

    return calcBonus(score, proficiency);
};

export const calcSavingBonus = (saving_throw: keyof AbilityScoreType) => {
    if (!character_sheet) return undefined;

    let proficiency = character_sheet.Stats.Proficiencies.Saving_Throws[saving_throw];

    let maths = calcBonus(saving_throw, proficiency);
    character_sheet.Equipment.Shields.forEach(shield => maths?.addVariables({name:shield.Name, bonus:Number(shield.Saving_Throw_Mods[saving_throw])}));

    return maths;

};

export const calcBonus = (
    ability: keyof AbilityScoreType,
    proficiency: string,
) => {
    if (!character_sheet) return undefined;

    let maths = new Calculation();

    maths.addVariables({name:ability, bonus:scoreToModifier(character_sheet.Stats.Ability_Scores[ability])});

    if (proficiency === "P") maths.addVariables({name:"Proficiency", bonus:getPB()});
    else if (proficiency === "E") maths.addVariables({name:"Expertise", bonus:getPB() * 2});

    return maths;
};

export const calcPassiveBonuses = (skill: keyof SkillProficiencyType) => {
    if (!character_sheet) return undefined;

    let maths = new Calculation();

    maths.addVariables({name:"Base", bonus:10});
    let observant = character_sheet.Features.Feats.find(x => x.Title === "Observant");

    // @ts-ignore
    maths.join(calcSkillBonus(skill));

    if(["Investigation", "Perception"].includes(skill) && observant) maths.addVariables({name:"Observant", bonus:5});

    return maths;
}

export const calcAC = () => {
    if (!character_sheet) return undefined;

    let maths = new Calculation();

    let armor = character_sheet.Equipment.Armor;
    let ability_bonus = calcBonus(armor.Ability, "")?.total;
    let enhancements = character_sheet.Equipment.Shields;
    if(ability_bonus === undefined) return;

    maths.addVariables({name:armor.Name, bonus:Number(armor.Base) + Number(armor.Bonus)})

    // @ts-ignore
    if(armor.Limit === "" || (Number(armor.Limit) !== 0 && ability_bonus <= Number(armor.Limit))) maths.addVariables({name:armor.Ability, bonus:ability_bonus});
    else maths.addVariables({name:armor.Ability, bonus:armor.Limit});

    enhancements?.forEach(shield => {
        maths.addVariables({name:shield.Name, bonus:Number(shield.Base) + Number(shield.Bonus)})
    })

    return maths;
}

export const calcAttackModifier = () => {
    if(!character_sheet) return undefined;

    let maths = new Calculation();

    let ability = character_sheet.Spellcasting.Ability as keyof AbilityScoreType;
    let ability_mod = scoreToModifier(character_sheet.Stats.Ability_Scores[ability]);

    maths.addVariables({name:ability, bonus:ability_mod});
    maths.addVariables({name:"Proficiency", bonus:getPB()});
    maths.addVariables({name:"Magic Item", bonus:character_sheet.Spellcasting.Bonus});

    return maths;
}

export const calcSaveDC = () => {
    if(!character_sheet) return undefined;

    let maths = new Calculation();

    maths.addVariables({name:"Base", bonus:8});
    // @ts-ignore
    maths.join(calcAttackModifier());

    return maths;
}

export const setCharacter = (ch: { data: CharacterSheet, name: string, id: string }) => {
    character_sheet = updateJsonFormatting(ch.data);
    
    character_id = ch.id;
    
    if(character_sheet !== ch.data) {
        ch.data = character_sheet!;
        updateDatabase().then(() => {});
    }

    character = ch;
}

const updateJsonFormatting = (character:CharacterSheet) => {
    let updatedCharacter;
    updatedCharacter = merge(CharacterTemplate, character);

    updatedCharacter.Equipment.Shields = 
        updatedCharacter.Equipment.Shields.map((x: any) => merge(ShieldTemplate, x));

    updatedCharacter.Equipment.Weapons = 
        updatedCharacter.Equipment.Weapons.map((x: any) => merge(WeaponTemplate, x));

    updatedCharacter.Equipment.Magic_Items = 
        updatedCharacter.Equipment.Magic_Items.map((x: any) => merge(MagicItemTemplate, x));

    return updatedCharacter;
}

// const backsetKeys = (object: any) => {
//     Object.keys(object).map(x => )
// }

export const createNewCharacter = (character_class: string, level: number) => {
    let character = CharacterTemplate;
    character.Level = level;
    character.Class = character_class;

    return character;
}

export const updateDatabase = async () => {
    savingPromise.set(true);
}

export const saveToDatabase = async () => {
    if (!supabase || !character_sheet || !character_id) return 10000;

    const { status } = await supabase.from("characters").update({ data: character_sheet }).eq("id", character_id).select('*');
    
    return status;
}

export const updateName = async () => {
    if (!supabase) return;

    await supabase.from("characters").update({ name: character.name }).eq("id", character_id);
}

export const updateTheme = async () => {
    if (!supabase) return;

    await supabase.from("characters").update({ theme: colors }).eq("id", character_id).select('*');
}

export const resetColors = async () => {
    if (!supabase) return;

    const { data } = await supabase.from("characters").select("theme").eq("id", character_id).single();

    if (!data) return;
    theme.set(data.theme);
}

export const getUserNames = async () => {
    if (!supabase) return;

    const { data } = await supabase.from("users").select("*");

    return data;
}

export const getUsersCharacters = async () => {
    if (!supabase) return;

    const { data } = await supabase.from("characters").select("*");

    return data;
}

export const upsertNewCharacter = async (character_class: string, character_level: number, character_name: string) => {
    if (!supabase) return;

    await supabase.from("characters").upsert({
        data: createNewCharacter(
            character_class,
            character_level,
        ),
        name: character_name,
    });
};


export const signInWithGoogle = async () => {
    console.log(process.env.PW_TEST_USERNAME);
    if (!supabase) return;

    if (process.env.PW_TEST_USERNAME && process.env.PW_TEST_PASSWORD) {
        await supabase.auth.signInWithPassword({
            email: process.env.PW_TEST_USERNAME,
            password: process.env.PW_TEST_PASSWORD
        });
    } else {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${PUBLIC_SITE_URL}${window.location.pathname.substring(1)}`,
            },
        });
    }
};