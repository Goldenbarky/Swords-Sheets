<script lang="ts">
    import { updateDatabase } from "$lib/GenericFunctions";
    import DropDownArrow from "./Generic/DropDownArrow.svelte";

    export let category_name:string;
    export let selected_ability:keyof AbilityScoreType;
    export let onChange:Function = () => {};

    let abilities = [
        "Strength",
        "Dexterity",
        "Constitution",
        "Intelligence",
        "Wisdom",
        "Charisma",
    ] as (keyof AbilityScoreType)[];

    let shown = false;
</script>

<div style="width: 100%; height: 1.2rem; position:absolute; z-index:2; bottom: -1px; display:flex; flex-direction:column; place-items:center;">
    <DropDownArrow
        bind:shown = {shown}
    />
    <div class="custom-box dropdown" style="{shown ? "" : "visibility: hidden; pointer-events: none"}">
        <div class="column">
            <div class="custom-title">{category_name} Ability</div>
            {#each abilities as ability}
                <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
                <div class="custom-subtitle {ability === selected_ability ? "selected" : ""}" on:click={() => {
                    selected_ability = ability;
                    updateDatabase();
                    onChange();
                }}>{ability}</div>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    .custom-title {
        @extend .title !optional;
        font-size: large;
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
        width: fit-content;
        color: var(--text);
        text-align: left;
        cursor: pointer;
    }
    .dropdown {
        width: 85%;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
        border-top: 0px;
        top: 1px;
    }
    .selected {
        color: var(--secondary);
    }
    .column {
        display: flex;
        flex-direction: column;
        padding: 0px;
        align-items: center;
    }
    
</style>