<script lang="ts">
    import { CharacterController } from "$lib/Database.svelte";
    import { abilities } from "$lib/GenericFunctions";
    import Divider from "../Helpers/Divider.svelte";

    let { character_sheet }: { character_sheet: CharacterSheet } = $props();

    let ability_scores = character_sheet.Stats.Ability_Scores;

    let ability_abbr = {
        "Strength":"Str",
        "Dexterity":"Dex",
        "Constitution":"Con",
        "Intelligence":"Int",
        "Wisdom":"Wis",
        "Charisma":"Cha"
    }
</script>
{#each abilities as ability, i}
    <div>
        {#if i === 0}
            <div class="row" style="padding-bottom: 0.5rem; justify-content: center;">
                <div class="row" style="width: 2rem; justify-content: center;">
                    <div class="label">Ability</div>
                </div>
                <div style="width: 1rem;"></div>
                <div class="row" style="width: 1.2rem; justify-content: center;">
                    <div class="label">Mod.</div>
                </div>
                <div style="width: 1rem;"></div>
                <div class="row" style="width: 1.2rem; justify-content: center;">
                    <div class="label">Save</div>
                </div>
            </div>
        {/if}
        <div class="ability-box">
            <div class="box custom-box ability-score-box">
                <div class="row">
                    <div class="row">
                        <div class="ability-name">{ability_abbr[ability]}</div>
                    </div>
                    <Divider
                        orientation="vertical"
                    />
                    <div class="row">
                        <div class="ability-score">{CharacterController.bonusToString(
                            CharacterController.scoreToModifier(ability_scores[ability]),
                        )}</div>
                    </div>
                    <Divider
                        orientation="vertical"
                    />
                    <div class="row" style="align-items: center;">
                        <div class="ability-score">{CharacterController.bonusToString(
                            CharacterController.calcSavingBonus(character_sheet, ability).total
                        )}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/each}
<style>
    .ability-box {
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        text-align: center;
        flex-direction: column;
    }
    .custom-box {
        border: 2px solid var(--border);
        padding: 0.75rem;
        padding-top: 0rem;
        background-color: var(--background);
    }
    .ability-name {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-weight: bold;
        color: var(--secondary);
        user-select: none;
        width: 2rem;
    }
    .ability-score-box {
        display: block;
        justify-content: space-between;
        position: relative;
        width: fit-content;
        border: 2px solid var(--border);
        padding: 6px;
        color: var(--text);
    }
    .ability-score {
        all: unset;
        font-size: 1rem;
        width: 1.2rem;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
    .label {
        border-bottom: 1px solid var(--border);
        font-size: 0.8rem;
        color: var(--secondary);
        display: flex;
        align-items: flex-end;
    }
</style>