type CharacterDataRow = {
    "id":string,
    "owner_id":string,
    "name":string,
    "data":CharacterSheet
    "theme":Theme
}

type CampaignDataRow = {
    "id":string,
    "owner_id":string,
    "name":string,
    "data":Campaign,
    "theme":Theme
}

type Campaign = {
    "Version":number,
    "Characters":string[],
    "Level":number
}

type Theme = {
    "Version":number,
    "primary":string,
    "secondary":string,
    "background":string,
    "background_hover":string,
    "text":string,
    "border":string
}

type CharacterSheet = {
    "Version":number,
    "Name":string,
    "Class":string,
    "Level":number,
    "Stats":{
        "Ability_Scores":AbilityScoreType,
        "Proficiencies":Proficiencies,
        "Health":{
            "Current":number,
            "Max":number,
            "Temp":number,
            "Hit_Dice":number
        },
        "Speed":number
    },
    "Features":{
        "Racial":TitleDescriptionType[],
        "Class":TitleDescriptionType[],
        "Feats":TitleDescriptionType[]
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
        "Prepared_Caster":boolean,
        "Learned_Caster":boolean,
        "Spell_Slots":SpellSlotCount,
        "Slots_Expended":SpellSlotCount
    },
    "Campaign":string,
    "Private":boolean
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
    "Saving_Throws":SavingThrowProfs,
    "Skills":SkillProficiencyType,
    "Weapons":string[],
    "Armor":string[],
    "Tools":string[],
    "Languages":string[]
}

type SavingThrowProfs = {
    "Strength":string,
    "Dexterity":string,
    "Constitution":string,
    "Intelligence":string,
    "Wisdom":string,
    "Charisma":string
}

type Weapon = {
    "Version":number,
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
    "Entries":TitleDescriptionType[]
}

type Armor = {
    "Version":number,
    "Name":string,
    "Ability":keyof AbilityScoreType,
    "Bonus":number,
    "Base":number,
    "Limit":number
}

type Shield = {
    "Version":number,
    "Name":string,
    "Base":number,
    "Bonus":number,
    "Saving_Throw_Mods": {
        "Strength":number,
        "Dexterity":number,
        "Constitution":number,
        "Intelligence":number,
        "Wisdom":number,
        "Charisma":number
      },
    "Entries":TitleDescriptionType
}

type MagicItem = {
    "Version":number,
    "Name":string,
    "Attuned":boolean,
    "Entries":TitleDescriptionType[]
}

type Spell = {
    "Spell_Name":string,
    "Prepared":string
}

type TitleDescriptionType = {
    "Version":number,
    "Title":string,
    "Description":{
        "Subtitle":string,
        "Paragraph":string
    }[],
    "Uses":{
        "Max":number,
        "Used":number
    }
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

type Variable = {
    name:string,
    bonus:number
}