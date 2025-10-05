<script lang="ts">
    import { getClassSpellList } from "$lib/5eToolsFunctions";
    import { CharacterController, DatabaseClient, SiteState } from "$lib/Database.svelte";
    import CheckedBox from "./Generic/CheckedBox.svelte";
    import Divider from "./Helpers/Divider.svelte";

    interface Props {
        shown: boolean;
        sourcebookData: SourcebookDataStructs;
    }

    let { shown = $bindable(), sourcebookData }: Props = $props();

    let mainClass = $state("");
    let subClass = $state("");
    let subclassSpellsOnly:boolean = $state(false);

    let sourcebooks = $state(Object.fromEntries(Object.keys(sourcebookData.spellsByClass).map(bookID => [bookID, (bookID != "xphb")])));
    let booksSorted = $derived(Object.keys(sourcebooks).map(x => (sourcebookData.bookNames.find(y => y.id === x)?.name)).sort());

    const getSubclasses = (mainClass:string) => {
        return sourcebookData.classes.find(x => x.Name === mainClass)?.Subclasses;
    }
    const activeSubclasses = $derived(getSubclasses(mainClass)??[]);

    const characterController = CharacterController.getContext();
    const siteState = SiteState.getContext();
</script>
<div class="modal {shown ? 'is-active' : ''}">
    <!-- svelte-ignore a11y_missing_attribute, a11y_no_static_element_interactions, a11y_click_events_have_key_events-->
    <div
        class="modal-background"
        style="position: fixed"
        onclick={() => {
            shown = false;
        }}
></div>
    <div class="modal-content" style="display: grid; align-items: center; justify-items: center; overflow: visible;">
        <div class="custom-box column" style="width: fit-content; height: fit-content; min-width: 30rem; padding-right: 2rem; padding-left: 2rem;">
            <div class="custom-title">Mass Add Spells</div>
            <div class="row">
                <div class="column" style="padding-top: 0;">
                    <div class="row">
                        <div class="column" style="padding-top: 0;">
                            <div class="row custom-subtitle">
                                Class
                                <div class="highlighted">*</div>
                            </div>
                            <div class="row">
                                <select
                                    name="mainClass"
                                    style="width: 100%;"
                                    bind:value={mainClass}
                                >
                                    <option value="Artificer">Artificer</option>
                                    <option value="Barbarian">Barbarian</option>
                                    <option value="Bard">Bard</option>
                                    <option value="Cleric">Cleric</option>
                                    <option value="Druid">Druid</option>
                                    <option value="Fighter">Fighter</option>
                                    <option value="Monk">Monk</option>
                                    <option value="Paladin">Paladin</option>
                                    <option value="Ranger">Ranger</option>
                                    <option value="Rogue">Rogue</option>
                                    <option value="Sorcerer">Sorcerer</option>
                                    <option value="Warlock">Warlock</option>
                                    <option value="Wizard">Wizard</option>
                                </select>
                            </div>
                        </div>
                        <div class="column" style="padding-top: 0;">
                            <div class="custom-subtitle">Subclass</div>
                            <select
                                name="subClass"
                                style="width: auto;"
                                bind:value={subClass}
                            >
                                {#each activeSubclasses as subcls (subcls)}
                                    <option value={subcls}>{subcls}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                    <div class="row" style="align-items: center">
                        <div style="padding-left: 0.75rem; padding-right:0.25rem;">
                            <CheckedBox
                                bind:checked = { subclassSpellsOnly }
                            />
                        </div>
                        <div class="custom-text">
                            Only Import Subclass Spells
                        </div>
                    </div>
                    <div class="column">
                        <div class="row" style="position: relative;">
                            <div class="custom-subtitle">
                                Sourcebooks
                            </div>
                            <button 
                                class="custom-box custom-button" 
                                style="position: absolute; right: 1.5rem;"
                                onclick={() => {
                                    Object.keys(sourcebooks).forEach(x => sourcebooks[x] = true);
                                }}
                            >
                                &check;
                                <div class="box tooltip-box">
                                    <div class="tooltip-text">Enable All</div>
                                </div>
                            </button>
                            <button 
                                class="custom-box custom-button" 
                                style="position: absolute; right: 0;"
                                onclick={() => {
                                    Object.keys(sourcebooks).forEach(x => sourcebooks[x] = false);
                                }}
                            >
                                X
                                <div class="box tooltip-box">
                                    <div class="tooltip-text">Disable All</div>
                                </div>
                            </button>
                        </div>
                        
                        <ul>
                            {#each booksSorted as book (book)}
                                {@const bookID = sourcebookData.bookNames.find(x => x.name == book)?.id}
                                {#if bookID}
                                    <div class="row" style="align-items: center; width:fit-content; padding-bottom: 0.25rem;">
                                        <div style="padding-left: 0.75rem; padding-right:0.25rem;">
                                            <CheckedBox
                                                bind:checked={sourcebooks[bookID]}
                                            />
                                        </div>
                                        <div class="custom-text" style="width:fit-content">
                                            {book}
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                        </ul>
                    </div>
                    <div class="row" style="padding-right: 0.75rem; justify-content: flex-end">
                        <button 
                            class="custom-box custom-button {mainClass == "" ? 'disabled' : ''}" 
                            disabled={mainClass == ""}
                            style="width: 5rem;"
                            onclick={() => {
                                let spells = getClassSpellList(sourcebookData.spellsByClass, mainClass, subClass, subclassSpellsOnly, sourcebooks);
                                
                                spells.forEach(spell => {
                                    let rawSpell = sourcebookData.spellsList.find(
                                        (x:SourceSpell) =>
                                            x["name"].toLowerCase() === spell.name.toLowerCase() &&
                                            x["source"].toLowerCase() === spell.source.toLowerCase()
                                    )

                                    if (rawSpell) characterController.addSpellToSheet(rawSpell);
                                });

                                siteState.save();
                            }}
                        >
                            Submit
                        </button>
                    </div>
                    
                </div>
            </div>
            <div style="height: 1rem;"></div>
        </div>
    </div>
</div>

<style>
    .modal {
        position: fixed;
        width: 100vw;
        height: 100vh;
    }
    .custom-box {
        display: block;
        margin-bottom: 1rem;
    }
    .custom-title {
        font-size: x-large;
        justify-content: center;
        text-align: center;
        font-weight: bold;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid var(--border);
        color: var(--text);
        width: 100%;
    }
    .custom-subtitle {
        font-size: large;
        text-align: left;
        width: fit-content;
        border-bottom: 1px solid var(--border);
        color: var(--text);
        margin-bottom: 0.5rem;
        width: 100%;
    }
    .custom-text {
        font-size: medium;
        text-align: left;
        width: fit-content;
        color: var(--text);
        width: 100%;
    }
    .highlighted {
        padding-left: 0.25rem;
        color: var(--secondary);
    }
    .custom-button {
        padding-bottom: 2px;
        background-color: var(--background);
        color: var(--text);
        margin-bottom: 0.2rem;
        margin-top: 0.2rem;
        border-width: 1px;
        padding-left: 0.25rem;
        padding-right: 0.25rem;
        user-select: none;
        color: var(--secondary);
        font-size: small;
        cursor: pointer;
        height: 1.25rem;
    }
    .custom-button:hover {
        background-color: var(--background_hover);
    }
    .column {
        display: flex;
        flex-direction: column;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
    select {
        all: unset;
        border: 1px solid var(--border);
        border-radius: 6px;
        backdrop-filter: brightness(75%);
        width: 95%;
        color: var(--text);
        padding-left: 5px;
    }
    .disabled {
        cursor: not-allowed;
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
    ul {
        -moz-column-count: 2;
        -moz-column-gap: 20px;
        -webkit-column-count: 2;
        -webkit-column-gap: 20px;
        column-count: 2;
        column-gap: 20px;
    }
</style>