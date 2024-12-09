<script lang="ts">
    import { CharacterController } from "$lib/Database.svelte";
    import { passive_skills, spell_slot_levels } from "$lib/GenericFunctions";
    import Divider from "../Helpers/Divider.svelte";
    import AbilityBoxSummaries from "./AbilityBoxSummaries.svelte";

    let { character }: { character: CharacterDataRow } = $props();

    let characterTheme:Theme = character.theme;
    let character_sheet:CharacterSheet = character.data;

    let to_hit = $state(CharacterController.calcSpellToHit(character_sheet)?.total as number);

    character_sheet.Equipment.Weapons.forEach(x => {
        let weapon_to_hit = CharacterController.calcWeaponToHit(character_sheet, x).total;
        if(weapon_to_hit > to_hit) to_hit = weapon_to_hit;
    });
</script>
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="custom-box" style="height: 26.9rem;" style:--primary={characterTheme.primary} style:--secondary={characterTheme.secondary} style:--background={characterTheme.background} style:--background_hover={characterTheme.background_hover} style:--border={characterTheme.border} style:--text={characterTheme.text}>
    <div class="color-tab"></div>
    <div class="border">
        <div class="custom-title">{character.name}</div>
        <div class="custom-subtitle" style="text-align: left; width: fit-content;">Level {character_sheet.Level} {character_sheet.Class}</div>
    </div>
    <div class="columns" style="align-items: center; width:100%; margin: 0; justify-content: flex-start; height: 100%; max-height: 100%; padding-right: 0.5rem;">
        <div class="custom-column">
            <AbilityBoxSummaries
                character_sheet={character_sheet}
            />
        </div>
        <div class="custom-column" style="width: 100%; justify-content: space-between;">
            <div class="row" style="justify-content: space-between;">
                <div class="custom-box content-box" style="width: fit-content;">
                    <div class="custom-subtitle">AC</div>
                    <div class="text">
                        {CharacterController.calcArmorClass(character_sheet).total}
                    </div>
                </div>
                <div class="custom-box content-box" style="width: fit-content;">
                    <div class="custom-subtitle">Health</div>
                    <div class="row">
                        <div class="text" style="color: var(--secondary);">{character_sheet.Stats.Health.Current}</div>
                        <div style="color: var(--border);">/</div>
                        <div class="text">{character_sheet.Stats.Health.Max}</div>
                    </div>
                </div>
                <div class="custom-box content-box" style="width: fit-content;">
                    <div class="custom-subtitle">Temp</div>
                    <div class="text">
                        {character_sheet.Stats.Health.Temp}
                    </div>
                </div>
                <div class="custom-box content-box" style="width: fit-content;">
                    <div class="custom-subtitle">Death Saves</div>
                    <div class="row">
                        <div class="death-numbers" style="color: green">{0}</div>
                        <Divider
                            orientation="vertical"
                        />
                        <div class="death-numbers" style="color: red">{0}</div>
                    </div>
                </div>
            </div>
            <div class="row" style="justify-content: space-between;">
                <div class="custom-column" style="margin: 0;">
                    <div class="custom-box content-box" style="margin-bottom: 0.5rem;">
                        <div class="row" style="padding-bottom: 0.25rem;">
                            <div class="row">
                                <div class="stat-name">Proficiency</div>
                            </div>
                            <Divider
                                orientation="vertical"
                            />
                            <div class="row">
                                <div class="stat-score">{CharacterController.bonusToString(CharacterController.getProficiencyBonus(character_sheet))}</div>
                            </div>
                        </div>
                        <div class="row" style="padding-bottom: 0.25rem;">
                            <div class="row">
                                <div class="stat-name">To Hit</div>
                            </div>
                            <Divider
                                orientation="vertical"
                            />
                            <div class="row">
                                <div class="stat-score">{CharacterController.bonusToString(to_hit)}</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="row">
                                <div class="stat-name">Speed</div>
                            </div>
                            <Divider
                                orientation="vertical"
                            />
                            <div class="row">
                                <div class="stat-score">{character_sheet.Stats.Speed}</div>
                            </div>
                        </div>
                    </div>
                    <div class="custom-box content-box">
                        <div class="custom-subtitle" style="width: 100%;">Passives</div>
                        {#each passive_skills as skill}
                            <div class="row" style="padding-bottom: 0.25rem;">
                                <div class="row">
                                    <div class="stat-name">{skill}</div>
                                </div>
                                <Divider
                                    orientation="vertical"
                                />
                                <div class="row">
                                    <div class="stat-score">{CharacterController.calcPassiveBonus(character_sheet, skill).total}</div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
                <div class="custom-column" style="justify-content: flex-start; width: 100%;">
                    <div class="custom-box content-box" style="width: 100%; margin-bottom: 0.5rem;">
                        <div class="row">
                            <div class="row">
                                <div class="stat-name">Spell DC</div>
                            </div>
                            <Divider
                                orientation="vertical"
                            />
                            <div class="row">
                                <div class="stat-score">{CharacterController.calcSaveDc(character_sheet).total}</div>
                            </div>
                        </div>
                    </div>
                    <div class="custom-box content-box" style="width: 100%;">
                        <div class="custom-subtitle" style="width: 100%;">Spell Slots</div>
                        <div class="spell-slot-grid">
                            {#each spell_slot_levels.filter(x => parseInt(x) <= 3) as spell_level}
                                {#if character_sheet.Spellcasting.Spell_Slots[spell_level] !== 0}
                                    <div class="column">
                                        <div class="spell-slot-row">
                                            <div class="stat-name spell-slot-level">{spell_level}</div>
                                        </div>
                                        <div class="spell-slot-row">
                                            <div class="text" style="color: var(--secondary);">{character_sheet.Spellcasting.Slots_Expended[spell_level]}</div>
                                            <div style="color: var(--border);">/</div>
                                            <div class="text">{character_sheet.Spellcasting.Spell_Slots[spell_level]}</div>
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                        <div class="spell-slot-grid">
                            {#each spell_slot_levels.filter(x => parseInt(x) > 3 && parseInt(x) <= 6) as spell_level}
                                {#if character_sheet.Spellcasting.Spell_Slots[spell_level] !== 0}
                                    <div class="column">
                                        <div class="spell-slot-row">
                                            <div class="stat-name spell-slot-level">{spell_level}</div>
                                        </div>
                                        <div class="spell-slot-row">
                                            <div class="text" style="color: var(--secondary);">{character_sheet.Spellcasting.Slots_Expended[spell_level]}</div>
                                            <div style="color: var(--border);">/</div>
                                            <div class="text">{character_sheet.Spellcasting.Spell_Slots[spell_level]}</div>
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                        <div class="spell-slot-grid">
                            {#each spell_slot_levels.filter(x => parseInt(x) > 6 && parseInt(x) <= 9) as spell_level}
                                {#if character_sheet.Spellcasting.Spell_Slots[spell_level] !== 0}
                                    <div class="column">
                                        <div class="spell-slot-row">
                                            <div class="stat-name spell-slot-level">{spell_level}</div>
                                        </div>
                                        <div class="spell-slot-row">
                                            <div class="text" style="color: var(--secondary);">{character_sheet.Spellcasting.Slots_Expended[spell_level]}</div>
                                            <div style="color: var(--border);">/</div>
                                            <div class="text">{character_sheet.Spellcasting.Spell_Slots[spell_level]}</div>
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<style>
    .custom-column {
        
        margin: 0rem 0rem 0rem 0.5rem;
        padding: 0rem 0rem 0rem 0rem;
        flex-direction: column;
        display: flex;
        align-items: center;
        height: 100%;
        justify-content: space-between;
    }
    .custom-box {
        border: 2px solid var(--border);
        padding: 0rem;
        padding-bottom: 0.5rem;
        background-color: var(--background);
        display: flex;
        flex-direction: column;
        align-items: start;
        border-radius: 6px;
        box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
        overflow: clip;
        cursor: default;
    }
    .content-box {
        padding: 5px 10px 5px 10px;
        align-items: center;
        width: 100%;
    }
    .custom-title {
        
        font-size: x-large;
        justify-content: center;
        text-align: center;
        font-weight: bold;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid var(--border);
        color: var(--text);
        width: fit-content;
    }
    .custom-subtitle {
        
        font-size: large;
        text-align: center;
        width: 100%;
        border-bottom: 1px solid var(--border);
        color: var(--secondary);
        margin-bottom: 0.5rem;
    }
    .border {
        padding-left: 0.5rem;
        text-wrap: nowrap;
    }
    .color-tab {
        width: 100%;
        height: 2rem;
        border-bottom: 1px solid var(--border);
        width: 100%;
        background-color: var(--primary);
    }
    .text {
        color: var(--text);
        text-align: center;
    }
    .row {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-evenly;
    }
    .column {
        display: flex;
        flex-direction: column;
        padding: 0px;
    }
    .stat-name {
        color: var(--secondary);
        width: 6rem;
        text-align: center;
    }
    .stat-score {
        color: var(--text);
        width: 100%;
        text-align: center;
    }
    .death-numbers {
        width: 1rem;
        text-align: center;
    }
    .spell-slot-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(33%, 1fr));
        grid-template-rows: 1fr;
        width: 100%;
    }
    .spell-slot-row {
        display: flex;
        flex-direction: row;
        height: 1rem;
        width: 100%;
        justify-content: space-evenly;
        align-items: center;
        margin-bottom: 0.3rem;
    }
    .spell-slot-level {
        width: 90%; 
        height: 1.4rem;
        border-bottom: 1px solid var(--border);
        margin-bottom: 0.3rem;
        font-weight: bold;
    }
</style>