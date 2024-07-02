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
    import * as GenericFunctions from "$lib/GenericFunctions";
    import CheckedBox from "$lib/Components/Generic/CheckedBox.svelte";
    import Divider from "$lib/Components/Helpers/Divider.svelte";

    export let character: CharacterSheet;

    let proficiencies = ["Weapons", "Armor", "Tools", "Languages"] as (keyof Proficiencies)[];

    let observant = character.Features.Feats.find(x => x.Title === "Observant");
</script>

<div
    class="columns has-text-centered"
    style="background-color: var(--background);"
>
    <div class="edge"></div>
    <div class="custom-column center">
        {#each GenericFunctions.abilities as ability}
            <AbilityBox
                name={ability}
                bind:score={character.Stats.Ability_Scores[ability]}
                mod={GenericFunctions.bonusToString(
                    GenericFunctions.scoreToModifier(character.Stats.Ability_Scores[ability]),
                )}
            />
        {/each}
    </div>
    <div class="column custom-column center">
        <div class="custom-box" style="width:18rem; padding:0px;">
            {#key character.Level}
                <NumberLabel
                    number={`+${GenericFunctions.getPB()}`}
                    label="Proficiency Bonus"
                />
            {/key}
        </div>
        <div class="custom-box" style="min-width: 18rem; padding-bottom: 0px;">
            <div class="custom-title">Proficiencies</div>
            {#each proficiencies as proficiency, i}
                {#if $mode === "edit" || character.Stats.Proficiencies[proficiency].length >= 1}
                    {#if i != 0}
                        <Divider orientation="horizontal"/>
                    {/if}
                    <ListLabel label={proficiency} bind:list={character.Stats.Proficiencies[proficiency]}/>
                {/if}
            {/each}
        </div>
        <div class="custom-box" style="width: 14rem; padding-bottom: 0px; margin-bottom: 0px;">
            <div class="custom-title">Passive Skills</div>
            {#key character.Stats.Ability_Scores}
                {#each GenericFunctions.passive_skills as passive_skill}
                    <NumberLabel
                        label={passive_skill}
                        number={GenericFunctions.calcPassiveBonuses(passive_skill)}
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
                {#each GenericFunctions.abilities as ability}
                    <Skill
                        bind:proficiency={character.Stats.Proficiencies.Saving_Throws[
                            ability
                        ]}
                        name={ability}
                        bonusCalculator={(a) => GenericFunctions.bonusToString(GenericFunctions.calcSavingBonus(a))}
                    />
                {/each}
            {/key}
        </div>
        <div class="custom-box">
            <div class="custom-title">Skills</div>
            {#key character.Stats.Ability_Scores}
                {#each GenericFunctions.skills as skill}
                    <Skill
                        name={skill}
                        bind:proficiency={character.Stats.Proficiencies.Skills[skill]}
                        bonusCalculator={(s) => GenericFunctions.bonusToString(GenericFunctions.calcSkillBonus(s))}
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
            <NumberLabel number={GenericFunctions.calcAC()} label={"Armor Class"}/>
            <NumberLabel bind:number={character.Stats.Speed} label={"Speed"} number_edit_modes={["edit"]}/>
            <NumberLabel number={GenericFunctions.bonusToString(GenericFunctions.calcBonus("Dexterity", ""))} label={"Initiative"}/>
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
