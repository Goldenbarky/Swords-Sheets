
import merge from "deepmerge-json";

import CharacterTemplate from "$lib/Data/CharacterTemplate.json";
import ShieldTemplate from "$lib/Data/ShieldTemplate.json";
import WeaponTemplate from "$lib/Data/WeaponTemplate.json";
import MagicItemTemplate from "$lib/Data/MagicItemTemplate.json";
import FeatureTemplate from "$lib/Data/FeatureTemplate.json";
import CampaignTemplate from "$lib/Data/CampaignTemplate.json";

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


// export const setCharacter = (ch:CharacterDataRow) => {
//     character_sheet = updateCharacterJsonFormatting(ch.data);
    
//     character_id = ch.id;
    
//     if(!ch.data.Version || character_sheet?.Version !== ch.data.Version) {
//         ch.data = character_sheet!;
//         updateDatabase().then(() => {});
//     }
    
//     character_sheet = ch.data;
//     character = ch;
// }

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

// export const setCampaign = (cpg:CampaignDataRow) => {
//     let campaignData = updateCampaignJsonFormatting(cpg.data);
    
//     campaign_id = cpg.id;
//     campaign_data = campaignData;

//     if(!cpg.data.Version || campaignData.Version !== cpg.data.Version) {
//         cpg.data = campaignData!;
//         updateDatabase().then(() => {});
//     }

//     campaign = cpg;
// }

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