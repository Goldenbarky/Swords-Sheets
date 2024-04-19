import type { SupabaseClient } from "@supabase/supabase-js";
import { theme } from "./Theme";
import { writable } from "svelte/store";
import { PUBLIC_SITE_URL } from "$env/static/public";
import { invalidateAll } from "$app/navigation";
import type { User } from '@supabase/gotrue-js';

let supabase: SupabaseClient | undefined;
export let supabaseObject = (supa?: SupabaseClient) => {
    if (supa) supabase = supa;
    return supabase;
};

export let user = writable<User | null>(null);

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

export const setCharacter = (ch: { data: CharacterSheet, name: string, id: string }) => {
    character_sheet = ch.data;
    character_id = ch.id;
    character = ch;


}

// const backsetKeys = (object: any) => {
//     Object.keys(object).map(x => )
// }

export const createNewCharacter = (character_class: string, level: number) => {
    return {
        "Class": character_class,
        "Level": level,
        "Stats": {
            "Speed": 30,
            "Health": {
                "Max": "0",
                "Temp": "0",
                "Current": "0",
                "Hit_Dice": "0"
            },
            "Proficiencies": {
                "Armor": [],
                "Tools": [],
                "Skills": {
                    "Arcana": "",
                    "Nature": "",
                    "History": "",
                    "Insight": "",
                    "Stealth": "",
                    "Medicine": "",
                    "Religion": "",
                    "Survival": "",
                    "Athletics": "",
                    "Deception": "",
                    "Acrobatics": "",
                    "Perception": "",
                    "Persuasion": "",
                    "Performance": "",
                    "Intimidation": "",
                    "Investigation": "",
                    "Slight of Hand": "",
                    "Animal Handling": ""
                },
                "Weapons": [],
                "Languages": [],
                "Saving_Throws": {
                    "Wisdom": "",
                    "Charisma": "",
                    "Strength": "",
                    "Dexterity": "",
                    "Constitution": "",
                    "Intelligence": ""
                }
            },
            "Ability_Scores": {
                "Wisdom": 10,
                "Charisma": 10,
                "Strength": 10,
                "Dexterity": 10,
                "Constitution": 10,
                "Intelligence": 10
            }
        },
        "Features": {
            "Class": [
                {
                    "Title": "",
                    "Description": []
                }
            ],
            "Feats": [],
            "Racial": []
        },
        "Equipment": {
            "Armor": {
                "Base": 10,
                "Name": "Unarmored",
                "Bonus": 0,
                "Limit": "",
                "Ability": "Dexterity"
            },
            "Shields": [],
            "Weapons": [],
            "Inventory": [],
            "Valuables": [],
            "Magic_Items": []
        },
        "Spellcasting": {
            "Spells": {
                "0": [],
                "1": [],
                "2": [],
                "3": [],
                "4": [],
                "5": [],
                "6": [],
                "7": [],
                "8": [],
                "9": []
            },
            "Ability": "Wisdom",
            "Bonus": 0,
            "Max_Prepared": 0,
            "Spell_Slots": {
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0,
                "6": 0,
                "7": 0,
                "8": 0,
                "9": 0
            },
            "Slots_Expended": {
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0,
                "6": 0,
                "7": 0,
                "8": 0,
                "9": 0
            }
        }
    }
}

export const updateDatabase = async () => {
    if (!supabase) return;

    await supabase.from("characters").update({ data: character_sheet }).eq("id", character_id).select('*');
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
    if (!supabase) return;

    await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${PUBLIC_SITE_URL}${window.location.pathname.substring(1)}`//`${PUBLIC_SITE_URL}auth/callback?next=${window.location.pathname}`,
        },
    });
};