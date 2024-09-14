import type { SupabaseClient } from "@supabase/supabase-js";
import { theme } from "./Theme";
import { writable } from "svelte/store";
import { PUBLIC_SITE_URL } from "$env/static/public";
import type { User } from '@supabase/gotrue-js';
import merge from "deepmerge-json";
import { Calculation } from "./Components/Classes/DataClasses";

import CharacterTemplate from "$lib/Data/CharacterTemplate.json";
import ShieldTemplate from "$lib/Data/ShieldTemplate.json";
import WeaponTemplate from "$lib/Data/WeaponTemplate.json";
import MagicItemTemplate from "$lib/Data/MagicItemTemplate.json";
import FeatureTemplate from "$lib/Data/FeatureTemplate.json";
import CampaignTemplate from "$lib/Data/CampaignTemplate.json";

let supabase: SupabaseClient | undefined;
export let supabaseObject = (supa?: SupabaseClient) => {
    if (supa) supabase = supa;
    return supabase;
};

export let user = writable<User | null>(null);

export let savingPromise = writable<boolean>(false);

let character_sheet:CharacterSheet|null;
let character_id:string|null;
let character:CharacterDataRow;

let campaign_data:Campaign|null;
let campaign_id:string|null;
let campaign:CampaignDataRow;

let colors:Theme;
theme.subscribe(a => colors = a);

export const bonusToString = (bonus: number) => {
    return `${bonus >= 0 ? "+" : ""}${bonus.toString()}`;
};

export const scoreToModifier = (score: number) => {
    let modifier = Math.floor(score / 2) - 5;
    return modifier;
};

export const getPB = (char:CharacterSheet|null = character_sheet) => {
    if (!char) return 0;
    let level = Number(char.Level);

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

export let spell_slot_levels = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
] as (keyof SpellSlotCount)[];

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

export const calcSkillBonus = (skill: keyof SkillProficiencyType, char:CharacterSheet|null = character_sheet) => {
    if (!char) return undefined;

    let proficiency = char.Stats.Proficiencies.Skills[skill];
    let score: keyof AbilityScoreType = skill_score_dictionary[skill] as keyof AbilityScoreType;

    return calcBonus(score, proficiency, char);
};

export const calcSavingBonus = (saving_throw: keyof AbilityScoreType, char:CharacterSheet|null = character_sheet) => {
    if (!char) return undefined;

    let proficiency = char.Stats.Proficiencies.Saving_Throws[saving_throw];

    let maths = calcBonus(saving_throw, proficiency, char);
    char.Equipment.Shields.forEach(shield => maths?.addVariables({name:shield.Name, bonus:Number(shield.Saving_Throw_Mods[saving_throw])}));

    return maths;
};

export const calcBonus = (
    ability: keyof AbilityScoreType,
    proficiency: string,
    char:CharacterSheet|null = character_sheet
) => {
    if (!char) return undefined;

    let maths = new Calculation();

    maths.addVariables({name:ability, bonus:scoreToModifier(char.Stats.Ability_Scores[ability])});

    if (proficiency === "P") maths.addVariables({name:"Proficiency", bonus:getPB(char)});
    else if (proficiency === "E") maths.addVariables({name:"Expertise", bonus:getPB(char) * 2});

    return maths;
};

export const calcPassiveBonuses = (skill: keyof SkillProficiencyType, char:CharacterSheet|null = character_sheet) => {
    if (!char) return undefined;

    let maths = new Calculation();

    maths.addVariables({name:"Base", bonus:10});
    let observant = char.Features.Feats.find(x => x.Title === "Observant");

    // @ts-ignore
    maths.join(calcSkillBonus(skill, char));

    if(["Investigation", "Perception"].includes(skill) && observant) maths.addVariables({name:"Observant", bonus:5});

    return maths;
}

export const calcAC = (char:CharacterSheet|null = character_sheet) => {
    if (!char) return undefined;

    let maths = new Calculation();

    let armor = char.Equipment.Armor;
    let ability_bonus = calcBonus(armor.Ability, "", char)?.total;
    let enhancements = char.Equipment.Shields;
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

export const calcSpellToHit = (char:CharacterSheet|null = character_sheet) => {
    if(!char) return undefined;

    let maths = new Calculation();

    let ability = char.Spellcasting.Ability as keyof AbilityScoreType;
    let ability_mod = scoreToModifier(char.Stats.Ability_Scores[ability]);

    maths.addVariables({name:ability, bonus:ability_mod});
    maths.addVariables({name:"Proficiency", bonus:getPB(char)});
    maths.addVariables({name:"Magic Item", bonus:char.Spellcasting.Bonus});

    return maths;
}

export const calcWeaponToHit = (weapon:Weapon, char:CharacterSheet|null = character_sheet) => {
    let proficiency_bonus = getPB(char);
    let modifier = getAbilityModifier(weapon.Ability) as number;

    let maths = new Calculation();

    maths.addVariables({name:weapon.Ability, bonus:modifier});
    if(weapon.Proficient) maths.addVariables({name:"Proficiency", bonus:proficiency_bonus});
    maths.addVariables({name:"Magic Item", bonus:weapon.Bonus});
    
    return maths;
}

export const calcSaveDC = (char:CharacterSheet|null = character_sheet) => {
    if(!char) return undefined;

    let maths = new Calculation();

    maths.addVariables({name:"Base", bonus:8});
    // @ts-ignore
    maths.join(calcSpellToHit(char));

    return maths;
}

export const setCharacter = (ch:CharacterDataRow) => {
    character_sheet = updateCharacterJsonFormatting(ch.data);
    
    character_id = ch.id;
    
    if(!ch.data.Version || character_sheet?.Version !== ch.data.Version) {
        ch.data = character_sheet!;
        updateDatabase().then(() => {});
    }
    
    character_sheet = ch.data;
    character = ch;
}

// To-do: Compare current version to template version and update if they don't match 
const updateCharacterJsonFormatting = (character:CharacterSheet) => {
    let updatedCharacter:CharacterSheet;
    updatedCharacter = merge(CharacterTemplate, character);

    updatedCharacter.Features.Class = 
        updatedCharacter.Features.Class.map((x: any) => merge(FeatureTemplate, x));

    updatedCharacter.Features.Feats = 
        updatedCharacter.Features.Feats.map((x: any) => merge(FeatureTemplate, x));

    updatedCharacter.Features.Racial = 
        updatedCharacter.Features.Racial.map((x: any) => merge(FeatureTemplate, x));

    updatedCharacter.Equipment.Shields = 
        updatedCharacter.Equipment.Shields.map((x: any) => merge(ShieldTemplate, x));

    updatedCharacter.Equipment.Weapons = 
        updatedCharacter.Equipment.Weapons.map((x: any) => merge(WeaponTemplate, x));

    updatedCharacter.Equipment.Magic_Items = 
        updatedCharacter.Equipment.Magic_Items.map((x: any) => merge(MagicItemTemplate, x));

    updatedCharacter.Version = CharacterTemplate.Version;

    return updatedCharacter;
}

export const setCampaign = (cpg:CampaignDataRow) => {
    let campaignData = updateCampaignJsonFormatting(cpg.data);
    
    campaign_id = cpg.id;
    campaign_data = campaignData;

    if(!cpg.data.Version || campaignData.Version !== cpg.data.Version) {
        cpg.data = campaignData!;
        updateDatabase().then(() => {});
    }

    campaign = cpg;
}

const updateCampaignJsonFormatting = (cpg:Campaign) => {
    let updatedCampaign:Campaign;

    updatedCampaign = merge(CampaignTemplate, cpg);

    updatedCampaign.Version = CampaignTemplate.Version;
    return updatedCampaign;
}

export const createNewCharacter = (character_class: string, level: number, name: string) => {
    let character = CharacterTemplate;
    character.Level = level;
    character.Class = character_class;
    character.Name = name;

    return character;
}

export const createNewCampaign = (characters:string[], campaign_level:number) => {
    let cpg = CampaignTemplate as Campaign;
    cpg.Characters = characters;
    cpg.Level = campaign_level;

    return cpg;
}

export const updateDatabase = async () => {
    console.log(character_sheet);
    savingPromise.set(true);
}

export const saveCharacter = async () => {
    if (!supabase || !character_sheet || !character_id) return 10000;

    console.log(character_sheet);

    const { status } = await supabase.from("characters").update({ data: character_sheet }).eq("id", character_id).select('*');
    
    return status;
}

export const saveCampaign = async () => {
    if (!supabase) return 10000;

    const { status } = await supabase.from("campaigns").update({ data: campaign.data }).eq("id", campaign_id).select('*');
    
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

export const getUsersCampaigns = async () => {
    if (!supabase) return;

    const { data } = await supabase.from("campaigns").select("*");

    return data;
}

export const getCharactersNames = async () => {
    if (!supabase) return;

    const { data } = await supabase.from("characters").select("Name");

    return data;
}

export const getCharacterID = async (name:string) => {
    if (!supabase) return;

    const { data } = await supabase.from("characters").select("id").eq("Name", name).single();

    return data;
}

export const getCampaign = async (id:string) => {
    if(!supabase) return;

    const { data } = await supabase.from("campaigns").select("*").eq("id", id).single();

    return data;
}

export const batchGetCharactersFromID = async (id:string[]) => {
    if (!supabase) return;

    const { data } = await supabase.from("characters").select("*").in("id", id);

    return data;
}

export const getInvitesForCampaign = async (campaign_id:string) => {
    if(!supabase) return;

    const { data } = await supabase.from("campaign_invites").select("character_invited").eq("campaign_id", campaign_id);

    return data;
}

export const getInvitesForCharacter = async (character_id:string) => {
    if(!supabase) return;

    const { data:campaign_id, error } = await supabase.from("campaign_invites").select("campaign_id").eq("character_invited", character_id);
    if(!campaign_id) return;
    
    const { data:campaign } = await supabase.from("campaigns").select("*").in("id", campaign_id?.map(x => x.campaign_id));

    return campaign;
}

export const upsertNewCampaign = async (campaign_name: string, campaign_level: number, characters:string[]) => {
    if (!supabase) return;

    let campaign = await supabase.from("campaigns").upsert({
        name: campaign_name,
        data: createNewCampaign(
            characters,
            campaign_level
        )
    }).select("id").single();

    characters.forEach(x => inviteCharacterToCampaign(campaign.data?.id, x));

    return campaign;
}

export const upsertNewCharacter = async (character_class: string, character_level: number, character_name: string) => {
    if (!supabase) return;

    await supabase.from("characters").upsert({
        data: createNewCharacter(
            character_class,
            character_level,
            character_name,
        ),
        name: character_name,
    });
};

export const inviteCharacterToCampaign = async (campaign_id:string, character_id:string) => {
    if(!supabase) return;

    await supabase.from("campaign_invites").upsert({
        campaign_id: campaign_id,
        character_invited: character_id,
    });
}

export const signInWithGoogle = async () => {
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

export const levenshteinDistance = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator, // substitution
            );
        }
    }
    return track[str2.length][str1.length];
};