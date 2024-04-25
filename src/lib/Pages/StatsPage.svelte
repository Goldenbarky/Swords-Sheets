<script lang="ts">
    //@ts-nocheck
    import AbilityBox from "$lib/Components/AbilityBox.svelte";
    import NumberLabel from "$lib/Components/Generic/NumberLabel.svelte";
    import DynamicNumberLabel from "$lib/Components/Generic/DynamicNumberLabel.svelte";
    import ListLabel from "$lib/Components/Generic/ListLabel.svelte";
    import Skill from "$lib/Components/Skill.svelte";
    import DeathSaves from "$lib/Components/DeathSaves.svelte";
    import FeaturesBox from "$lib/Components/FeaturesBox.svelte";
    import { mode } from "$lib/Theme";
    import { scoreToModifier, bonusToString, getPB } from "$lib/GenericFunctions";
    import CheckedBox from "$lib/Components/Generic/CheckedBox.svelte";

    export let character: CharacterSheet;

    let proficiencies = ["Weapons", "Armor", "Tools", "Languages"] as (keyof Proficiencies)[];

    let abilities = [
        "Strength",
        "Dexterity",
        "Constitution",
        "Intelligence",
        "Wisdom",
        "Charisma",
    ] as (keyof AbilityScoreType)[];
    let skills = [
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
    let skill_score_dictionary = {
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
    let passive_skills = [
        "Insight",
        "Investigation",
        "Perception",
    ] as (keyof SkillProficiencyType)[];

    let observant = character.Features.Feats.find(x => x.Title === "Observant");

    const calcSkillBonus = (skill: keyof SkillProficiencyType) => {
        let proficiency = character.Stats.Proficiencies.Skills[skill];
        let score: keyof AbilityScoreType = skill_score_dictionary[skill] as keyof AbilityScoreType;

        return calcBonus(score, proficiency);
    };

    const calcSavingBonus = (saving_throw: keyof AbilityScoreType) => {
        let proficiency = character.Stats.Proficiencies.Saving_Throws[saving_throw];

        let bonuses = 0;
        character.Equipment.Shields.forEach(shield => bonuses += Number(shield.Saving_Throw_Mods[saving_throw]));

        return calcBonus(saving_throw, proficiency) + bonuses;
    };

    const calcBonus = (
        ability: keyof AbilityScoreType,
        proficiency: string,
    ) => {
        let proficiency_bonus = getPB();
        let modifier = scoreToModifier(character.Stats.Ability_Scores[ability]) as number;

        if (proficiency === "P") modifier += proficiency_bonus;
        else if (proficiency === "E") modifier += proficiency_bonus * 2;

        return modifier;
    };

    const calcPassiveBonuses = (skill: keyof SkillProficiencyType) => {
        let bonus = 10;

        bonus += calcSkillBonus(skill);
        if(["Investigation", "Perception"].includes(skill) && observant) bonus += 5;

        return bonus;
    }

    const calcAC = () => {
        let armor = character.Equipment.Armor;
        let ability_bonus = calcBonus(armor.Ability, "");
        let enhancements = character.Equipment.Shields;

        let ac = Number(armor.Base) + armor.Bonus;

        if((armor.Limit === "" || ability_bonus <= Number(armor.Limit)) && Number(armor.Limit) !== 0) ac += ability_bonus;
        else ac += Number(armor.Limit);

        enhancements?.forEach(shield => {
            ac += Number(shield.Base) + shield.Bonus;
        })

        return ac;
    }
</script>

<div
    class="columns has-text-centered"
    style="background-color: var(--background);"
>
    <div class="edge"></div>
    <div class="custom-column center">
        {#each abilities as ability}
            <AbilityBox
                name={ability}
                bind:score={character.Stats.Ability_Scores[ability]}
                mod={bonusToString(
                    scoreToModifier(character.Stats.Ability_Scores[ability]),
                )}
            />
        {/each}
    </div>
    <div class="column custom-column center">
        <div class="custom-box" style="width:18rem; padding:0px;">
            {#key character.Level}
                <NumberLabel
                    number={`+${getPB()}`}
                    label="Proficiency Bonus"
                />
            {/key}
        </div>
        <div class="custom-box" style="min-width: 18rem; padding-bottom: 0px;">
            <div class="custom-title">Proficiencies</div>
            {#each proficiencies as proficiency, i}
                {#if $mode === "edit" || character.Stats.Proficiencies[proficiency].length >= 1}
                    <ListLabel label={proficiency} bind:list={character.Stats.Proficiencies[proficiency]}/>
                    {#if i != proficiencies.length - 1}
                        <div style="margin: 0rem; border-top: 1px solid var(--border); height: 1px"/>
                    {/if}
                {/if}
            {/each}
        </div>
        <div class="custom-box" style="width: 14rem; padding-bottom: 0px; margin-bottom: 0px;">
            <div class="custom-title">Passive Skills</div>
            {#key character.Stats.Ability_Scores}
                {#each passive_skills as passive_skill}
                    <NumberLabel
                        label={passive_skill}
                        number={calcPassiveBonuses(passive_skill)}
                        bold_label={false}
                    />
                {/each}
            {/key}
        </div>
        {#if $mode === "edit"}
            <div class="custom-box row" style="border-top: 0px; border-radius: 0px 0px 6px 6px; padding-top:0.5rem; pointer-events: none;">
                <CheckedBox
                    checked={observant}
                />
                <div style="width: 0.5rem;"/>
                <div style="color: var(--text);">Observant?</div>
            </div>
        {/if}
        <div style="height: 1rem;"/>
    </div>
    <div class="custom-column center">
        <div class="custom-box">
            <div class="custom-title">Saving Throws</div>
            {#key character.Stats.Ability_Scores}
                {#each abilities as ability}
                    <Skill
                        bind:proficiency={character.Stats.Proficiencies.Saving_Throws[
                            ability
                        ]}
                        name={ability}
                        bonusCalculator={(a) => bonusToString(calcSavingBonus(a))}
                    />
                {/each}
            {/key}
        </div>
        <div class="custom-box">
            <div class="custom-title">Skills</div>
            {#key character.Stats.Ability_Scores}
                {#each skills as skill}
                    <Skill
                        name={skill}
                        bind:proficiency={character.Stats.Proficiencies.Skills[skill]}
                        bonusCalculator={(s) => bonusToString(calcSkillBonus(s))}
                    />
                {/each}
            {/key}
        </div>
    </div>
    <div class="column custom-column center">
        <div class="custom-box" style="width:17rem; padding:0px;">
            <DynamicNumberLabel
                bind:current={character.Stats.Health.Current}
                label={"Hit Points"}
                bind:max={character.Stats.Health.Max}
            />
            <DynamicNumberLabel
                bind:current={character.Stats.Health.Hit_Dice}
                label={"Hit Dice"}
                max={character.Level}
                max_edit_modes={[]}
            />
        </div>
        <div class="custom-box" style="width:17rem; padding:0px;">
            <NumberLabel bind:number={character.Stats.Health.Temp} label="Temp HP" number_edit_modes={["use"]}/>
        </div>
        <div class="custom-box" style="width:17rem; padding:0px;">
            <NumberLabel number={calcAC()} label={"Armor Class"}/>
            <NumberLabel number={character.Stats.Speed.toString()} label={"Speed"}/>
            <NumberLabel number={bonusToString(calcBonus("Dexterity", ""))} label={"Initiative"}/>
        </div>
        <div class="custom-box" style="width: 100%;">
            <div class="custom-title">Death Saves</div>
            <DeathSaves/>
        </div>
    </div>
    <div class="custom-column center">
        <FeaturesBox
            title="Racial Features"
            bind:features={character.Features.Racial}
        />
    </div>
    <div class="edge"></div>
</div>

<style lang="scss">
    .custom-column {
        @extend .column !optional;
        margin: 0.75rem;
        margin-top: 1.5rem;
        padding: 0px;
        flex-direction: column;
        display: flex;
        align-items: center;
        background-color: var(--background);
    }
    .custom-title {
        @extend .title !optional;
        font-size: x-large;
        justify-content: center;
        text-align: center;
        font-weight: bold;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid var(--border);
        color: var(--secondary);
        user-select: none;
        cursor: default;
    }
    .custom-box {
        display: block;
        margin-bottom: 1rem;
    }
    .edge {
        width: 15%;
        flex-shrink: 1;
        margin-top: 0.75rem;
        background-color: var(--background);
    }
    .row {
        display: flex;
        flex-direction: row;
    }
</style>
