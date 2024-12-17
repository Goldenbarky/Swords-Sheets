<script lang="ts">
    import { Calculation } from "../Classes/DataClasses";
    import Divider from "../Helpers/Divider.svelte";
    import CalculationVisualizer from "./CalculationVisualizer.svelte";
    import { CharacterController, SiteState } from "$lib/Database.svelte";

    let {
        number = $bindable(),
        label = $bindable(),
        label_placeholder = "Placeholder",
        bold_label = true,
        number_edit_modes = [],
        label_edit_modes = [],
        incremental = false,
        number_font_size = "large",
        label_font_size = "x-large",
        vertical_margins = true,
        calculation,
    }: {
        number: number;
        label: string;
        label_placeholder?: string;
        bold_label?: boolean;
        number_edit_modes?: string[];
        label_edit_modes?: string[];
        incremental?: boolean;
        number_font_size?: string;
        label_font_size?: string;
        vertical_margins?: boolean;
        calculation?: Calculation;
    } = $props();

    let placeholder = "\u{221E}";

    const siteState = SiteState.getContext();
    const characterController = CharacterController.getContext();
</script>

<div
    class="row"
    style={vertical_margins
        ? "margin:0.5rem;"
        : "margin-left:0.5rem; margin-right:0.5rem;"}
>
    <div class="row" style="align-items:center;">
        {#if incremental && number_edit_modes.includes(characterController.mode)}
            <button
                class="custom-box custom-button custom-tiny-button"
                style="font-size: {number_font_size}"
                onclick={() => {
                    number--;
                    siteState.save();
                }}
            >
                <div style="position: relative; top: 2.5px">-</div>
            </button>
        {/if}
        <input
            class="value {number_edit_modes.includes(characterController.mode) ? 'editable' : ''}"
            style="font-size: {number_font_size}"
            disabled={!number_edit_modes.includes(characterController.mode)}
            onchange={() => siteState.save()}
            bind:value={number}
            {placeholder}
        />
        {#if incremental && number_edit_modes.includes(characterController.mode)}
            <button
                class="custom-box custom-button custom-tiny-button"
                style="font-size: {number_font_size}"
                onclick={() => {
                    number++;
                    siteState.save();
                }}
            >
                <div style="position: relative; top: 2.5px">+</div>
            </button>
        {/if}
    </div>
    <Divider />
    <input
        class="custom-title {bold_label
            ? 'bold'
            : 'not-bold'} {label_edit_modes.includes(characterController.mode) ? 'editable' : ''}"
        style="font-size: {label_font_size}"
        disabled={!label_edit_modes.includes(characterController.mode)}
        onchange={() => siteState.save()}
        bind:value={label}
        placeholder={label_placeholder}
    />
    <div class="row" style="align-items: center">
        {#if calculation !== undefined}
            <CalculationVisualizer maths={calculation} />
        {/if}
    </div>
</div>

<style>
    .custom-title {
        
        font-size: x-large;
        justify-content: center;
        text-align: center;
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
