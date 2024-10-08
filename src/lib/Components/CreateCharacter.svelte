<script lang="ts">
    import { goto } from "$app/navigation";
    import { upsertNewCharacter } from "$lib/GenericFunctions";

    export let userAuthorized;
    export let shown:boolean;

    let character_name: string;
    let character_class: string;
    let character_level: number;
</script>
<div class="modal {shown ? 'is-active' : ''}">
    <!-- svelte-ignore a11y-missing-attribute a11y-no-static-element-interactions a11y-click-events-have-key-events-->
    <div
        class="modal-background"
        on:click={() => {
            shown = false;
        }}
    />
    <div class="modal-content" style="display: grid; align-items: center; justify-items: center;">
        <div class="custom-box column" style="width: fit-content; height: fit-content;">
            <div class="custom-title">Make a New Character</div>
            <div class="row">
                <div class="custom-subtitle">Name</div>
                <div class="spell-detail custom-button">?
                    <div class="box tooltip-box">
                        <div class="tooltip-text">
                            This will be the URI to your character sheet, it must be unique but can be changed later. There is also an option to add a display name for the top of the sheet, so it's best to choose something short and representative here.
                        </div>
                    </div>
                </div>
            </div>
            <input bind:value={character_name} maxlength="25"/>
            <div class="row">
                <div
                    class="column"
                    style="padding-left: 0px; padding-right: 0px;"
                >
                    <div class="custom-subtitle">Class</div>
                    <input
                        list="classes"
                        name="myClass"
                        type="search"
                        bind:value={character_class}
                    />
                    <datalist id="classes">
                        <option value="Artificer" />
                        <option value="Barbarian" />
                        <option value="Bard" />
                        <option value="Cleric" />
                        <option value="Druid" />
                        <option value="Fighter" />
                        <option value="Monk" />
                        <option value="Paladin" />
                        <option value="Ranger" />
                        <option value="Rogue" />
                        <option value="Sorcerer" />
                        <option value="Warlock" />
                        <option value="Wizard" />
                    </datalist>
                </div>
                <div style="width: 1rem;" />
                <div
                    class="column"
                    style="padding-left: 0px; padding-right: 0px;"
                >
                    <div class="custom-subtitle">Level</div>
                    <input
                        type="number"
                        id="level"
                        min="1"
                        max="20"
                        bind:value={character_level}
                    />
                </div>
            </div>
            <button
                class="custom-box custom-button {!userAuthorized
                    ? 'disabled'
                    : ''}"
                style="border: solid 1px var(--border);"
                on:click={async () => {
                    if (userAuthorized) {
                        await upsertNewCharacter(character_class, character_level, character_name);
                        goto(
                            `https://justin.pakj.games/${character_name}/edit`,
                        );
                    }
                }}
            >
                Create Character
            </button>
        </div>
    </div>
</div>

<style lang="scss">
    .modal {
        position: absolute;
        width: 100vw;
        height: 100vh;
    }
    .custom-title {
        @extend .title !optional;
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
        @extend .title !optional;
        font-size: large;
        text-align: left;
        width: fit-content;
        border-bottom: 1px solid var(--border);
        color: var(--text);
        margin-bottom: 0.5rem;
        width: 100%;
    }
    .custom-box {
        border: 2px solid var(--border);
        padding: 0.75rem;
        padding-top: 0rem;
        background-color: var(--background);
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 6px;
        box-shadow:
            0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
            0 0px 0 1px rgba(10, 10, 10, 0.02);
    }
    .custom-button {
        padding-bottom: 2px;
        background-color: var(--background);
        color: var(--text);
        margin-bottom: 0.2rem;
        border: 0px;
        user-select: none;
        font-size: small;
        cursor: pointer;
    }
    .custom-button:hover {
        background-color: var(--background_hover);
    }
    .row {
        display: flex;
        flex-direction: row;
    }
    .column {
        display: flex;
        flex-direction: column;
    }
    input {
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

    .spell-detail{
        outline: 1.5px solid var(--border);
        border-radius: 35%;
        width: 1.2rem;
        height: 1.2rem;
        font-size: small;
        font-weight: 500;
        display: inline-block;
        justify-items: center;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding-bottom: 1px;
        margin-left: 0.5rem;
        color: var(--secondary);
        user-select: none;
    }
    .tooltip-box {
        border: 2px solid var(--border);
        padding: 0.75rem;
        padding-bottom: 0.25rem;
        padding-top: 0.25rem;
        background-color: var(--background);
        height: fit-content;
        width: fit-content;
        margin-bottom: 0px;
        visibility: hidden;
        position: absolute;
        margin-top: 5px;
        z-index: 1;
    }
    .tooltip-text {
        visibility: hidden;
        text-align: center;
        width: 15rem;
        color: var(--text);
    }
    .spell-detail:hover .tooltip-box {
        visibility: visible;
    }
    .spell-detail:hover .tooltip-text {
        visibility: visible;
    }
</style>