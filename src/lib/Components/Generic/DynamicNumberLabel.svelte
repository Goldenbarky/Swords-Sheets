<script lang="ts">
    import { updateDatabase } from "$lib/GenericFunctions";
    import { mode } from "$lib/Theme";

    export let current:number;
    export let label:string;
    export let max:number;
    export let bold_label:boolean=true;
    export let current_edit_modes:string[] = ["use"];
    export let max_edit_modes:string[] = ["edit"];

</script>
    <div class="row" style="margin:0.5rem;">
        <input class="value" disabled={!current_edit_modes.includes($mode)} on:change={updateDatabase} bind:value={current}/>
        <div class="buffer" style="border-right: 1px solid var(--border)"></div>
        <div class="buffer"></div>
        <div class="custom-title {bold_label ? 'bold' : 'not-bold'}">{label}</div>
        <div class="buffer" style="border-right: 1px solid var(--border)"></div>
        <div class="buffer"></div>
        <input class="value max" disabled={!max_edit_modes.includes($mode)} on:change={updateDatabase} bind:value={max}/>
    </div>
<style lang="scss">
    .custom-title {
        @extend .title !optional;
        font-size: x-large;
        justify-content: center;
        text-align:center;
        width: calc(100% - 7rem);
        cursor: default;
    }
    .bold {
        color: var(--secondary);
        font-weight: bold;
    }
    .not-bold {
        color: var(--text);
        font-size: medium;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
    .value {
        all:unset;
        font-size: large;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        color: var(--text);
    }
    .max {
        color: var(--secondary);
    }
    .buffer {
        width: 0.5rem;
    }
</style>