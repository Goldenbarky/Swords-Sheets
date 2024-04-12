type CharacterSheet = {
    "Class":string,
    "Level":number,
    "Stats":{
        "Ability_Scores":AbilityScoreType,
        "Proficiency_Bonus":number,
        "Proficiencies":Proficiencies,
        "Health":{
            "Current":number,
            "Max":number,
            "Temp":number,
            "Hit_Dice":number
        },
        "Armor_Class":number,
        "Speed":number
    },
    "Features":{
        "Racial":TitleDescription[],
        "Class":TitleDescription[],
        "Feats":TitleDescription[]
    },
    "Equipment":{
        "Weapons":Weapon[],
        "Armor":Armor,
        "Shields":Shield[],
        "Inventory":{
            "Name":string,
            "Amount":number
        }[],
        "Magic_Items":MagicItem[],
        "Valuables":{
            "Name":string,
            "Amount":number
        }[]
    },
    "Spellcasting":{
        "Ability":string,
        "Bonus":number,
        "Spells":{
            "0":Spell[],
            "1":Spell[],
            "2":Spell[],
            "3":Spell[],
            "4":Spell[],
            "5":Spell[],
            "6":Spell[],
            "7":Spell[],
            "8":Spell[],
            "9":Spell[],
        },
        "Max_Prepared":number,
        "Spell_Slots":SpellSlotCount,
        "Slots_Expended":SpellSlotCount
    }
}

type AbilityScoreType = {
    "Strength":number,
    "Dexterity":number,
    "Constitution":number,
    "Intelligence":number,
    "Wisdom":number,
    "Charisma":number
}

type SkillProficiencyType = {
    "Acrobatics":string,
    "Animal Handling":string,
    "Arcana":string,
    "Athletics":string,
    "Deception":string,
    "History":string,
    "Insight":string,
    "Intimidation":string,
    "Investigation":string,
    "Medicine":string,
    "Nature":string,
    "Perception":string,
    "Performance":string,
    "Persuasion":string,
    "Religion":string,
    "Slight of Hand":string,
    "Stealth":string,
    "Survival":string
}

type Proficiencies = {
    "Saving_Throws":{
        "Strength":string,
        "Dexterity":string,
        "Constitution":string,
        "Intelligence":string,
        "Wisdom":string,
        "Charisma":string
    }
    "Skills":SkillProficiencyType,
    "Weapons":string[],
    "Armor":string[],
    "Tools":string[],
    "Languages":string[]
}

type Weapon = {
    "Name":string,
    "Ability":keyof AbilityScoreType,
    "Bonus":number,
    "Proficient":boolean,
    "Base_Damage":{
        "Dice":string,
        "Type":string
    }
    "Extra_Damage":{
        "Damage":string,
        "Type":string
    }[],
    "Entries":{
        "Subtitle":string,
        "Paragraph":string
    }[]
}

type Armor = {
    "Name":string,
    "Ability":keyof AbilityScoreType,
    "Bonus":number,
    "Base":number,
    "Limit":number
}

type Shield = {
    "Name":string,
    "Base":number,
    "Bonus":number,
    "Entries":TitleDescription
}

type MagicItem = {
    "Name":string,
    "Attuned":boolean,
    "Entries":TitleDescription
}

type Spell = {
    "Spell_Name":string,
    "Prepared":boolean
}

type TitleDescription = {
    "Title":string,
    "Description":{
        "Subtitle":string,
        "Paragraph":string
    }[]
}

type SpellSlotCount = {
    "1":number,
    "2":number,
    "3":number,
    "4":number,
    "5":number,
    "6":number,
    "7":number,
    "8":number,
    "9":number,
}