<script lang="ts">
    import { updateDatabase } from "$lib/GenericFunctions";
    import { mode } from "$lib/Theme";
    import { Calculation } from "../Classes/DataClasses";
    import Divider from "../Helpers/Divider.svelte";
    import CalculationVisualizer from "./CalculationVisualizer.svelte";

    export let number:number;
    export let label:string;
    export let label_placeholder:string = "Placeholder";
    export let bold_label:boolean=true;
    export let number_edit_modes:string[]=[];
    export let label_edit_modes:string[]=[];
    export let incremental:boolean = false;
    export let number_font_size:string = "large";
    export let label_font_size:string = "x-large";
    export let vertical_margins:boolean = true;
    // @ts-ignore
    export let calculation:Calculation = undefined;

    let placeholder = "\u{221E}";
    
</script>

<div class="row" style="{vertical_margins ? 'margin:0.5rem;' : 'margin-left:0.5rem; margin-right:0.5rem;'}">
    <div class="row" style="align-items:center;">
        {#if incremental && number_edit_modes.includes($mode) && typeof(number) === "number"}
            <button class="custom-box custom-button custom-tiny-button" style="font-size: {number_font_size}" on:click={() => {
                number--;
                updateDatabase();
            }}>-</button>
        {/if}
        <input class="value {number_edit_modes.includes($mode) ? 'editable' : ''}" style="font-size: {number_font_size}" disabled={!number_edit_modes.includes($mode)} on:change={updateDatabase} bind:value={number} placeholder={placeholder}/>
        {#if incremental && number_edit_modes.includes($mode)}
            <button class="custom-box custom-button custom-tiny-button" style="font-size: {number_font_size}" on:click={() => {
                number++;
                updateDatabase();
            }}>+</button>
        {/if}
    </div>
    <Divider/>
    <input class="custom-title {bold_label ? 'bold' : 'not-bold'} {label_edit_modes.includes($mode) ? 'editable' : ''}" style="font-size: {label_font_size}" disabled={!label_edit_modes.includes($mode)} on:change={updateDatabase} bind:value={label} placeholder={label_placeholder}/>
    <div class="row" style="align-items: center">
        {#if calculation !== undefined && $mode === "edit"}
            <CalculationVisualizer
                maths={calculation}
            />
        {/if}
    </div>
</div>

<style lang="scss">
    .custom-title {
        @extend .title !optional;
        font-size: x-large;
        justify-content: center;
        text-align:center;
        width: var(--width, calc(100% - 3.5rem));
        cursor: default;
        user-select: none;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
    .value {
        all: unset;
        font-size: large;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        color: var(--text);
        user-select: none;
    }
    .editable {
        cursor: text !important;
    }
    input {
        all: unset;
    }
    ::placeholder {
        color: var(--text);
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
    .custom-button:hover {
        background-color: var(--background_hover);
    }
    .custom-tiny-button {
        display: flex;
        width: 0.1rem;
        height: 1rem;
        padding: 0rem 0.4rem 0rem 0.4rem;
        justify-content: flex-end;
        margin-top: 0.3rem;
    }
    .bold {
        font-weight: bold;
        color: var(--secondary);
    }
    .not-bold {
        color: var(--text);
    }
</style>