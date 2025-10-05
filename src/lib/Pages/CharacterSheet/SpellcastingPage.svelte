<script lang="ts">
    import AbilitySelector from "$lib/Components/AbilitySelector.svelte";
    import CheckedBox from "$lib/Components/Generic/CheckedBox.svelte";
    import DynamicNumberLabel from "$lib/Components/Generic/DynamicNumberLabel.svelte";
    import NumberLabel from "$lib/Components/Generic/NumberLabel.svelte";
    import ToggleSwitch from "$lib/Components/Generic/ToggleSwitch.svelte";
    import Divider from "$lib/Components/Helpers/Divider.svelte";
    import MassAddSpells from "$lib/Components/MassAddSpells.svelte";
    import Spell from "$lib/Components/Spell.svelte";
    import { CharacterController, SiteState } from "$lib/Database.svelte";
    import { levenshteinDistance } from "$lib/GenericFunctions";
    import { onMount, setContext } from "svelte";

    let {
        character = $bindable(),
        sourcebookData,
    }: { character: CharacterSheet; sourcebookData:SourcebookDataStructs } =
        $props();
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
        "Ninth Level",
    ];

    const removeSpell = (spell:SourceSpell) => {
        character.Spellcasting.Spells[spell.level] =
            character.Spellcasting.Spells[spell.level].filter(
                (x) =>
                    !(
                        x.Spell_Name === spell.name &&
                        (x.Source ?? spell.source) === spell.source
                    ),
            );
        if (spell.level !== 0) spells_known--;

        siteState.save();
    };

    const inheritSpellList = (spellList: string) => {
        console.log(sourcebookData?.spellsByClass);
    };

    const calcKnown = () => {
        let num = 0;

        for (let i = 1; i <= 9; i++) {
            character.Spellcasting.Spells[i as keyof SpellLevels].forEach((x) => num++);
        }

        return num;
    };

    const calcPrepared = () => {
        let prepared = 0;

        Object.keys(character.Spellcasting.Spells).forEach((level) => {
            if (level !== "0") {
                character.Spellcasting.Spells[level as unknown as keyof SpellLevels].forEach((spell:CharacterSpell) => {
                    if (String(spell.Prepared) === "true") prepared++;
                });
            }
        });

        return prepared;
    };

    let spellList:SourceSpell[] = $state(sourcebookData!.spellsList);

    let num_prepared = $state(calcPrepared());
    let attack_modifier = $state(characterController.getSpellToHitBonusCalc());
    let save_dc = $state(characterController.getSaveDcCalc());
    let spells_known = $state(calcKnown());

    let massAddShown= $state(false);

    const changePrepared = (
        prepared: string,
        changeToAlways: boolean = false,
    ) => {
        if (changeToAlways) {
            if (prepared === "true") num_prepared--;
            return;
        }

        if (prepared === "true") num_prepared++;
        else num_prepared--;
    };

    const changeAbility = () => {
        attack_modifier = characterController.getSpellToHitBonusCalc();
        save_dc = characterController.getSaveDcCalc();
    };

    const spell_names = $derived(sourcebookData ? Object.values(sourcebookData.spellsList) : []);
    let spell_query = $state("");

    const filter_array = $derived(
        spell_names
            .filter((x) =>
                x.name.toLowerCase().includes(spell_query.toLowerCase()),
            )
            .sort((a, b) => {
                return (
                    levenshteinDistance(
                        a.name.toLowerCase(),
                        spell_query.toLowerCase(),
                    ) -
                    levenshteinDistance(
                        b.name.toLowerCase(),
                        spell_query.toLowerCase(),
                    )
                );
            })
            .slice(0, 5),
    );

    let spellNameEl = $state<HTMLDivElement>()!;
    let sidebarEl = $state<HTMLDivElement>()!;
    let elems: HTMLDivElement[] = $state([]);

    const editSizes = () => {
        if (!sidebarEl) return;
        
        let clientRect = sidebarEl.getBoundingClientRect();
        spellNameEl.style.marginLeft = `${clientRect.right - clientRect.left + 30}px`;
        elems.forEach(element => {
            let rect = element.getBoundingClientRect();
            if (rect.top <= clientRect.bottom) {
                element.style.marginLeft = `${clientRect.right - clientRect.left + 30}px`;
            } else {
                element.style.marginLeft = `0`;
            }
        });
    }

    let spellDropdownDispatcher:{ receivers:((expand:boolean) => void)[]} = $state({
        receivers: []
    });
    
    setContext("spellDropdownDispatcher", () => spellDropdownDispatcher);

    const cascadeExpansion = (expand:boolean) => {
        for(const receiver of spellDropdownDispatcher.receivers) {
            receiver?.(expand);
        }
    }

    $effect(() => {
        characterController.mode;
        editSizes();
    });

    onMount(() => {
        (async () => {
            console.log(sourcebookData?.spellsByClass);
        })();
    });
</script>

<div
    class="columns has-text-centered"
    style="background-color: var(--background); position:relative"
>
    <div class="edge"></div>
    <div
        class="custom-column center"
        style="position:absolute; left: 5%;"
        bind:this={sidebarEl}
    >
        <div
            class="center"
            style="width: fit-content; display: flex; flex-direction: column; align-items: center; position: relative;"
        >
            <div class="row" style="position: relative;">
                <div
                    style="display: flex; flex-direction: column; position: relative;"
                >
                    <div class="custom-box" style="margin-bottom:0px;">
                        <div class="custom-title">Spellcasting</div>
                        <NumberLabel
                            label="Attack Modifier"
                            number={CharacterController.bonusToString(
                                attack_modifier.total,
                            )}
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
                            category_name="Spellcasting"
                            bind:selected_ability={character.Spellcasting
                                .Ability as keyof AbilityScoreType}
                            onChange={changeAbility}
                        />
                    {/if}
                </div>
                <div
                    style="display: flex; flex-direction: column; position: absolute; right: -19px"
                >
                    {#each [0, 1, 2, 3] as bonus}
                        {#if characterController.mode === "edit" || (bonus === character.Spellcasting.Bonus && bonus !== 0)}
                            <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                            <div
                                class="custom-box custom-side-tab {characterController.mode !==
                                'edit'
                                    ? 'disable'
                                    : ''} {character.Spellcasting.Bonus ===
                                bonus
                                    ? 'selected'
                                    : ''}"
                                onclick={() => {
                                    character.Spellcasting.Bonus = bonus;
                                    attack_modifier =
                                        characterController.getSpellToHitBonusCalc();
                                    save_dc =
                                        characterController.getSaveDcCalc();
                                    siteState.save();
                                }}
                            >
                                +{bonus}
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
        {#if characterController.mode === "edit"}
            <div
                class="custom-box"
                style="width:100%; margin-top: 1rem; margin-bottom: 0px;"
            >
                <div class="custom-title" style="position: relative;">
                    Add A New Spell
                    <button class="custom-box custom-button" style="display: inline; position: absolute; top: 3px; right: 0px;"
                        onclick={() => massAddShown = true}
                    >!</button>
                </div>
                <input bind:value={spell_query} />
                {#if spell_query.length > 0}
                    <Divider orientation="horizontal" />
                    {#each filter_array as spell (spell)}
                        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                        <div
                            class="custom-button"
                            style="font-size:medium;"
                            onclick={() => {
                                if (
                                    !character.Spellcasting.Spells[
                                        spell.level
                                    ].find(
                                        (x) =>
                                            spell.name === x.Spell_Name &&
                                            spell.source === x.Source,
                                    )
                                ) {
                                    character.Spellcasting.Spells[
                                        spell.level
                                    ].push({
                                        Spell_Name: spell.name,
                                        Prepared: "false",
                                        Source: spell.source,
                                    });
                                    character.Spellcasting.Spells[
                                        spell.level
                                    ].sort((a, b) =>
                                        a.Spell_Name.localeCompare(
                                            b.Spell_Name,
                                        ),
                                    );
                                    if (spell.level !== 0) spells_known++;
                                    siteState.save();
                                }
                            }}
                        >
                            {spell.name} <b>{spell.source}</b>
                        </div>
                    {/each}
                {/if}
            </div>
        {/if}
        {#if characterController.mode === "edit" || character.Spellcasting.Learned_Caster}
            <div
                class="custom-box"
                style="padding-bottom: 0px; width: 20.5rem; margin-bottom: 0px; margin-top: 1rem;"
            >
                <NumberLabel
                    label="Spells Known"
                    number={spells_known}
                    --width="14.3rem;"
                />
            </div>
        {/if}
        {#if characterController.mode == "edit"}
            <div
                class="custom-box"
                style="border-top: 0px; border-radius: 0px 0px 6px 6px; padding-top: 0.5rem; margin-bottom: 0px"
            >
                <ToggleSwitch
                    title="Show Known Count?"
                    bind:toggle={character.Spellcasting.Learned_Caster}
                    on_update={() => siteState.save()}
                />
            </div>
        {/if}
        {#if characterController.mode === "edit" || character.Spellcasting.Prepared_Caster}
            <div
                class="custom-box"
                style="padding-bottom: 0px; margin-bottom: 0px; margin-top: 1rem;"
            >
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
            <div
                class="custom-box"
                style="border-top: 0px; border-radius: 0px 0px 6px 6px; padding-top: 0.5rem; margin-bottom: 0px"
            >
                <ToggleSwitch
                    title="Show Prepared Count?"
                    bind:toggle={character.Spellcasting.Prepared_Caster}
                    on_update={() => siteState.save()}
                />
            </div>
        {/if}
        <div class="custom-box" style="width: 100%; margin-top: 1rem;">
            <div class="custom-title">Spell Slots</div>
            {#each Object.values(character.Spellcasting.Spell_Slots) as slots, i}
                {#if characterController.mode === "edit" || slots !== 0}
                    <div
                        class="row custom-subtitle"
                        style="width:100%; text-align:center;"
                    >
                        {#if characterController.mode === "edit"}
                            <button
                                class="custom-box custom-button custom-tiny-button"
                                style="margin-top:0.5rem;"
                                onclick={() => {
                                    if (
                                        character.Spellcasting.Spell_Slots[
                                            (i + 1) as keyof SpellSlotCount
                                        ] > 0
                                    ) {
                                        character.Spellcasting.Spell_Slots[
                                            (i + 1) as keyof SpellSlotCount
                                        ]--;
                                        siteState.save();
                                    }
                                }}>-</button
                            >
                        {/if}
                        <div
                            class="custom-subtitle"
                            style="border-width: 0px; margin-bottom: 0px; width: 8rem; text-align: center;"
                        >
                            {spell_levels[i + 1]}
                        </div>
                        {#if characterController.mode === "edit"}
                            <button
                                class="custom-box custom-button custom-tiny-button"
                                style="margin-top:0.5rem;"
                                onclick={() => {
                                    if (
                                        character.Spellcasting.Spell_Slots[
                                            (i + 1) as keyof SpellSlotCount
                                        ] < 10
                                    ) {
                                        character.Spellcasting.Spell_Slots[
                                            (i + 1) as keyof SpellSlotCount
                                        ]++;
                                        siteState.save();
                                    }
                                }}>+</button
                            >
                        {/if}
                    </div>
                    <div
                        class="row {characterController.mode === 'view'
                            ? 'disable'
                            : ''}"
                    >
                        {#each Array(slots) as _, j}
                            <CheckedBox
                                checkmark="X"
                                color={siteState.theme.secondary}
                                checked={j <
                                    character.Spellcasting.Slots_Expended[
                                        (i + 1) as keyof SpellSlotCount
                                    ]}
                                bind:checked_counter={
                                    character.Spellcasting.Slots_Expended[(i + 1) as keyof SpellSlotCount]
                                }
                            />
                        {/each}
                    </div>
                    {#if Object.values(character.Spellcasting.Spell_Slots)[i + 1] !== 0}
                        <div style="height:0.5rem;"></div>
                    {/if}
                {/if}
            {/each}
        </div>
    </div>
    <div class="column custom-column center">
        <div class="" style="width:100%;">
            <div class="custom-title row" style="position: relative;" bind:this={spellNameEl}>
                Spells
                <button 
                    class="custom-box custom-button" 
                    style="position: absolute; right: 1.5rem; bottom: 0; bottom: 0; padding-left: 0.25rem; padding-right: 0.25rem;"
                    onclick={() => {
                        cascadeExpansion(true);
                    }}
                >
                    &#9660;
                    <div class="box tooltip-box">
                        <div class="tooltip-text">Expand All</div>
                    </div>
                </button>
                <button 
                    class="custom-box custom-button" 
                    style="position: absolute; right: 0; bottom: 0; padding-left: 0.25rem; padding-right: 0.25rem;"
                    onclick={() => {
                        cascadeExpansion(false);
                    }}
                >
                    &#9650;
                    <div class="box tooltip-box">
                        <div class="tooltip-text">Collapse All</div>
                    </div>
                </button>
            </div> 
            {#key character.Spellcasting.Spells}
                {#each Object.values(character.Spellcasting.Spells) as level, i (i)}
                    <div bind:this={elems[i]}>
                        {#if level.length != 0}
                            <div
                                class="custom-subtitle"
                                style="font-size: x-large;"
                            >
                                {spell_levels[i] + " Spells"}
                            </div>
                            <div class="grid">
                                {#if sourcebookData}
                                    {#each level as item (item)}
                                        {@const spell = sourcebookData.spellsList.find(
                                            (x:SourceSpell) =>
                                                x["name"].toLowerCase() === item.Spell_Name.toLowerCase() &&
                                                x["source"].toLowerCase() ===
                                                    (item.Source?.toLowerCase() ??
                                                        x["source"].toLowerCase()),
                                        )!}
                                        <Spell
                                            {spell}
                                            bind:prepared={item.Prepared}
                                            onChange={changePrepared}
                                            removeFunction={removeSpell}
                                            onExpand={editSizes}
                                        />
                                    {/each}
                                {/if}
                            </div>
                        {/if}
                    </div>
                {/each}
            {/key}
        </div>
    </div>
    <div class="edge"></div>
    <MassAddSpells
        bind:shown = {massAddShown}
        sourcebookData = {sourcebookData}
    />
</div>

<style>
    .custom-column {
        margin: 0.75rem;
        margin-top: 1.5rem;
        padding: 0px;
        flex-direction: column;
        display: flex;
        align-items: center;
        background-color: var(--background);
    }
    .custom-title {
        font-size: x-large;
        justify-content: center;
        text-align: center;
        font-weight: bold;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid var(--border);
        color: var(--secondary);
    }
    .custom-subtitle {
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
    .tooltip-box {
        visibility: hidden;
        border: 2px solid var(--border);
        padding: 0.75rem;
        padding-bottom: 0.25rem;
        padding-top: 0.25rem;
        background-color: var(--background);
        height: fit-content;
        width: fit-content;
        margin-bottom: 0px;
        position: absolute;
        margin-top: 5px;
        z-index: 1;
    }
    .tooltip-text {
        visibility: hidden;
        text-align: right;
        color: var(--secondary)
    }
    .custom-button:hover .tooltip-box {
        visibility: visible;
    }
    .custom-button:hover .tooltip-text {
        visibility: visible;
    }
</style>
