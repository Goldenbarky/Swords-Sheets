<script lang="ts">
    import AbilityBox from "$lib/Components/AbilityBox.svelte";
    import NumberLabel from "$lib/Components/Generic/NumberLabel.svelte";
    import DynamicNumberLabel from "$lib/Components/Generic/DynamicNumberLabel.svelte";
    import ListLabel from "$lib/Components/Generic/ListLabel.svelte";
    import Skill from "$lib/Components/Skill.svelte";
    import DeathSaves from "$lib/Components/DeathSaves.svelte";
    import FeaturesBox from "$lib/Components/FeaturesBox.svelte";
    import * as GenericFunctions from "$lib/GenericFunctions";
    import CheckedBox from "$lib/Components/Generic/CheckedBox.svelte";
    import Divider from "$lib/Components/Helpers/Divider.svelte";
    import { CharacterSheetController } from "$lib/Database.svelte";

    let { character = $bindable() }: { character: CharacterSheet; } = $props();

    const characterController = CharacterSheetController.getCharacterController();

    let proficiencies = ["Weapons", "Armor", "Tools", "Languages"] as (keyof Proficiencies)[];

    let observant = $derived(character.Features.Feats.find(x => x.Title === "Observant"));
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
                mod={CharacterSheetController.bonusToString(
                    CharacterSheetController.scoreToModifier(character.Stats.Ability_Scores[ability]),
                )}
            />
        {/each}
    </div>
    <div class="column custom-column center">
        <div class="custom-box" style="width:18rem; padding:0px;">
            {#key character.Level}
                <NumberLabel
                    number={`+${characterController.getProficiencyBonus()}`}
                    label="Proficiency Bonus"
                />
            {/key}
        </div>
        <div class="custom-box" style="min-width: 18rem; padding-bottom: 0px;">
            <div class="custom-title">Proficiencies</div>
            {#each proficiencies as proficiency, i}
                {#if characterController.mode === "edit" || character.Stats.Proficiencies[proficiency].length >= 1}
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
                {@const bonusCalculation = characterController.getPassiveBonus(passive_skill)}
                    <NumberLabel
                        label={passive_skill}
                        number={bonusCalculation?.total}
                        bold_label={false}
                        label_font_size={"medium"}
                        calculation={bonusCalculation}
                    />
                {/each}
            {/key}
        </div>
        {#if characterController.mode === "edit"}
            <div class="custom-box row" style="border-top: 0px; border-radius: 0px 0px 6px 6px; padding-top:0.5rem; pointer-events: none;">
                <CheckedBox
                    checked={observant}
                />
                <div style="width: 0.5rem;"></div>
                <div style="color: var(--text);">Observant?</div>
            </div>
        {/if}
        <div style="height: 1rem;"></div>
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
                            bonusCalculator={(a) => characterController.getSavingBonus(a)}
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
                        bonusCalculator={(s) => characterController.getSkillBonus(s)}
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
            <NumberLabel number={characterController.getArmorClass().total} label={"Armor Class"} calculation={characterController.getArmorClass()}/>
            <NumberLabel bind:number={character.Stats.Speed} label={"Speed"} number_edit_modes={["edit"]}/>
            <NumberLabel number={CharacterSheetController.bonusToString(characterController.calcBonus("Dexterity", "")?.total)} label={"Initiative"}/>
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
