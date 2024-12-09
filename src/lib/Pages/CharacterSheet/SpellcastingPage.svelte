<script lang="ts">
    import AbilitySelector from "$lib/Components/AbilitySelector.svelte";
    import CheckedBox from "$lib/Components/Generic/CheckedBox.svelte";
    import DynamicNumberLabel from "$lib/Components/Generic/DynamicNumberLabel.svelte";
    import NumberLabel from "$lib/Components/Generic/NumberLabel.svelte";
    import ToggleSwitch from "$lib/Components/Generic/ToggleSwitch.svelte";
    import Divider from "$lib/Components/Helpers/Divider.svelte";
    import Spell from "$lib/Components/Spell.svelte";
    import { CharacterController, SiteState } from "$lib/Database.svelte";
    import { levenshteinDistance } from "$lib/GenericFunctions";

    let { character = $bindable(), spells }: { character: CharacterSheet, spells: Record<string, unknown> } = $props();

    const siteState = SiteState.getContext();
    const characterController = CharacterController.getContext();

    let spell_levels = [
        "Cantrips",
        "First Level",
        "Second Level",
        "Third Level",
        "Fourth Level",
        "Fifth Level",
        "Sixth Level",
        "Seventh Level",
        "Eighth Level",
        "Ninth Level"
    ];

    const removeSpell = (spell: any) => {
        character.Spellcasting.Spells[spell.level] = character.Spellcasting.Spells[spell.level].filter(x => !(x.Spell_Name === spell.name && (x.Source ?? spell.source) === spell.source));
        if(spell.level !== 0) spells_known--;

        siteState.save();
    }

    const calcKnown = () => {
        let num = 0;

        for(let i = 1; i <= 9; i++) {
            character.Spellcasting.Spells[i].forEach(x => num++);
        }

        return num;
    }

    const calcPrepared = () => {
        let prepared = 0;

        Object.keys(character.Spellcasting.Spells).forEach(level => {
            if(level !== "0") {
                character.Spellcasting.Spells[level].forEach(spell => {
                    if(String(spell.Prepared) === "true") prepared++;
                });
            }
        });

        return prepared;
    }

    let num_prepared = $state(calcPrepared());
    let attack_modifier = $state(characterController.getSpellToHitBonusCalc());
    let save_dc = $state(characterController.getSaveDcCalc());
    let spells_known = $state(calcKnown());

    const changePrepared = (prepared:string, changeToAlways:boolean = false) => {
        if(changeToAlways) {
            if(prepared === "true") num_prepared--;
            return;
        }
        
        if(prepared === "true") num_prepared++;
        else num_prepared--;
    }

    const changeAbility = () => {
        attack_modifier = characterController.getSpellToHitBonusCalc();
        save_dc = characterController.getSaveDcCalc();
    }

    const spell_names = Object.values(spells);
    let spell_query = $state("");

    const filter_array = $derived(spell_names.filter(x => x.name.toLowerCase().includes(spell_query.toLowerCase())).sort((a, b) => {
        return levenshteinDistance(a.name.toLowerCase(), spell_query.toLowerCase()) - levenshteinDistance(b.name.toLowerCase(), spell_query.toLowerCase());
    }).slice(0, 5));
</script>

<div class="columns has-text-centered" style="background-color: var(--background);">
    <div class="edge"></div>
    <div class="custom-column center">
        <div class="center" style="width: fit-content; display: flex; flex-direction: column; align-items: center; position: relative;">
            <div class="row" style="position: relative;">
                <div style="display: flex; flex-direction: column; position: relative;">
                    <div class="custom-box" style="margin-bottom:0px;">
                        <div class="custom-title">Spellcasting</div>
                        <NumberLabel
                            label="Attack Modifier"
                            number={CharacterController.bonusToString(attack_modifier.total)}
                            bold_label={false}
                            label_font_size="medium"
                            calculation={attack_modifier}
                        />
                        <NumberLabel
                            label="Save DC"
                            number={save_dc.total}
                            bold_label={false}
                            label_font_size="medium"
                            calculation={save_dc}
                        />
                    </div>
                    {#if characterController.mode === "edit"}
                        <AbilitySelector
                            category_name = "Spellcasting"
                            bind:selected_ability = {character.Spellcasting.Ability as keyof AbilityScoreType}
                            onChange = {changeAbility}
                        />
                    {/if}
                </div>
                <div style="display: flex; flex-direction: column; position: absolute; right: -19px">
                    {#each [0, 1, 2, 3] as bonus}
                        {#if characterController.mode === "edit" || (bonus === character.Spellcasting.Bonus && bonus !== 0)}
                            <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                            <div class="custom-box custom-side-tab {characterController.mode !== "edit" ? "disable" : ""} {character.Spellcasting.Bonus === bonus ? "selected" : ""}" onclick={() => {
                                character.Spellcasting.Bonus = bonus;
                                attack_modifier = characterController.getSpellToHitBonusCalc();
                                save_dc = characterController.getSaveDcCalc();
                                siteState.save();
                            }}>+{bonus}</div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
        {#if characterController.mode === "edit"}
            <div class="custom-box" style="width:100%; margin-top: 1rem; margin-bottom: 0px;">
                <div class="custom-title">Add A New Spell</div>
                <input bind:value={spell_query}/>
                {#if spell_query.length > 0}
                    <Divider
                        orientation="horizontal"
                    />
                    {#each filter_array as spell (spell)}
                        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                        <div class="custom-button" style="font-size:medium;" onclick={() => {
                            if(!character.Spellcasting.Spells[spell.level].find(x => spell.name === x.Spell_Name && spell.source === x.Source)) {
                                character.Spellcasting.Spells[spell.level].push(({"Spell_Name":spell.name, "Prepared":"false", "Source": spell.source}))
                                character.Spellcasting.Spells[spell.level].sort((a, b) => a.Spell_Name.localeCompare(b.Spell_Name));
                                if(spell.level !== 0) spells_known++;
                                siteState.save();
                            }
                        }}>{spell.name} <b>{spell.source}</b></div>
                    {/each}
                {/if}
            </div>
        {/if}
        {#if characterController.mode === "edit" || character.Spellcasting.Learned_Caster}
            <div class="custom-box" style="padding-bottom: 0px; width: 20.5rem; margin-bottom: 0px; margin-top: 1rem;">
                <NumberLabel
                    label="Spells Known"
                    number={spells_known}
                    --width="14.3rem;"
                />
            </div>
        {/if}
        {#if characterController.mode == "edit"}
            <div class="custom-box" style="border-top: 0px; border-radius: 0px 0px 6px 6px; padding-top: 0.5rem; margin-bottom: 0px">
                <ToggleSwitch
                    title="Show Known Count?"
                    bind:toggle={character.Spellcasting.Learned_Caster}
                />
            </div>
        {/if}
        {#if characterController.mode === "edit" || character.Spellcasting.Prepared_Caster}
        <div class="custom-box" style="padding-bottom: 0px; margin-bottom: 0px; margin-top: 1rem;">
            <DynamicNumberLabel
                label="Spells Prepared"
                current={num_prepared}
                bind:max={character.Spellcasting.Max_Prepared}
                bold_label={true}
                current_edit_modes={[]}
            />
        </div>
        {/if}
        {#if characterController.mode == "edit"}
            <div class="custom-box" style="border-top: 0px; border-radius: 0px 0px 6px 6px; padding-top: 0.5rem; margin-bottom: 0px">
                <ToggleSwitch
                    title="Show Prepared Count?"
                    bind:toggle={character.Spellcasting.Prepared_Caster}
                />
            </div>
        {/if}
        <div class="custom-box" style="width: 100%; margin-top: 1rem;">
            <div class="custom-title">Spell Slots</div>
            {#each Object.values(character.Spellcasting.Spell_Slots) as slots, i}
                {#if characterController.mode === "edit" || slots !== 0}
                    <div class="row custom-subtitle" style="width:100%; text-align:center;">
                        {#if characterController.mode === "edit"}
                            <button class="custom-box custom-button custom-tiny-button" style="margin-top:0.5rem;" onclick={() => {
                                if(character.Spellcasting.Spell_Slots[i+1] > 0) {
                                    character.Spellcasting.Spell_Slots[i+1]--;
                                    siteState.save();
                                }
                            }}>-</button>
                        {/if}
                        <div class="custom-subtitle" style="border-width: 0px; margin-bottom: 0px; width: 8rem; text-align: center;">
                            {spell_levels[i + 1]}
                        </div>
                        {#if characterController.mode === "edit"}
                            <button class="custom-box custom-button custom-tiny-button" style="margin-top:0.5rem;" onclick={() => {
                                if(character.Spellcasting.Spell_Slots[i+1] < 10) {
                                    character.Spellcasting.Spell_Slots[i+1]++;
                                    siteState.save();
                                }
                            }}>+</button>
                        {/if}
                    </div>
                    <div class="row {characterController.mode === "view" ? "disable" : ""}">
                        {#each Array(slots) as _, j}
                            <CheckedBox 
                                checkmark="X"
                                color={siteState.theme.secondary}
                                checked = {j < character.Spellcasting.Slots_Expended[i+1]}
                                bind:checked_counter = {character.Spellcasting.Slots_Expended[i+1]}
                            />
                        {/each}
                    </div>
                    {#if Object.values(character.Spellcasting.Spell_Slots)[i+1] !== 0}
                        <div style="height:0.5rem;"></div>
                    {/if}
                {/if}
            {/each}
        </div>
    </div>
    <div class="column custom-column center">
        <div class="" style="width:100%;">
            <div class="custom-title">Spells</div>
            {#key character.Spellcasting.Spells}
                {#each Object.values(character.Spellcasting.Spells) as level, i (level)}
                    {#if level.length != 0}
                        <div class="custom-subtitle" style="font-size: x-large;">{spell_levels[i] + " Spells"}</div>
                        <div class="grid">
                            {#each level as item (item)}
                                {@const spell = spells.find(x => x["name"] === item.Spell_Name && x["source"] === (item.Source ?? x["source"]))}
                                <Spell
                                    spell={spell}
                                    bind:prepared={item.Prepared}
                                    onChange = {changePrepared}
                                    removeFunction = {removeSpell}
                                />
                            {/each}
                        </div>
                    {/if}
                {/each}
            {/key}
        </div>
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
    }
    .custom-subtitle {
        @extend .title !optional;
        font-size: large;
        text-align: left;
        width: fit-content;
        border-bottom: 1px solid var(--border);
        color: var(--secondary);
        margin-bottom: 0.5rem;
    }
    .custom-box {
        display: block;
        margin-bottom: 1rem;
    }
    .custom-side-tab {
        font-size: x-small;
        padding: 0.15rem;
        margin: 0px;
        margin-top: 0.45rem;
        border-radius: 0px 6px 6px 0px;
        border-left: 0px;
        color: var(--text);
        cursor: pointer;
        user-select: none;
    }
    .selected {
        border-color: var(--secondary);
        color: var(--secondary);
    }
    .edge {
        width: 5%;
        flex-shrink: 1;
        margin-top: 0.75rem;
        background-color: var(--background);
    }
    .grid {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        gap: 0.5rem;
    }
    .row {
        display: flex;
        flex-direction: row;
        place-content: space-evenly;
    }
    .disable {
        pointer-events: none;
    }
    .custom-button {
        padding-bottom: 2px;
        background-color: var(--background);
        color: var(--text);
        margin-bottom: 0.2rem;
        margin-top: 0.2rem;
        border-width: 1px;
        user-select: none;
        color: var(--secondary);
        font-size: small;
        cursor: pointer;
    }
    .custom-tiny-button {
        display: flex;
        width: 0.1rem;
        height: 1rem;
        padding: 0rem 0.4rem 0rem 0.4rem;
        justify-content: flex-end;
        margin-top: 0.3rem;
        margin-right: 0.3rem;
    }
    .custom-button:hover {
        background-color: var(--background_hover);
    }
    input {
        all: unset;
        border: 1px solid var(--border);
        border-radius: 6px;
        backdrop-filter: brightness(75%);
    }
</style>