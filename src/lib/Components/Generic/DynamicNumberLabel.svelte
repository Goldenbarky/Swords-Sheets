<script lang="ts">
    import { CharacterController, SiteState } from "$lib/Database.svelte";

    interface Props {
        current: number;
        label: string;
        max: number;
        bold_label?: boolean;
        current_edit_modes?: string[];
        max_edit_modes?: string[];
    }

    let {
        current = $bindable(),
        label,
        max = $bindable(),
        bold_label = true,
        current_edit_modes = ["use"],
        max_edit_modes = ["edit"]
    }: Props = $props();

    const siteState = SiteState.getContext();
    const characterController = CharacterController.getContext();
</script>
<div class="row" style="margin:0.5rem;">
    <input class="value" disabled={!current_edit_modes.includes(characterController.mode)} onchange={() => siteState.save()} bind:value={current}/>
    <div class="buffer" style="border-right: 1px solid var(--border)"></div>
    <div class="buffer"></div>
    <div class="custom-title {bold_label ? 'bold' : 'not-bold'}">{label}</div>
    <div class="buffer" style="border-right: 1px solid var(--border)"></div>
    <div class="buffer"></div>
    <input class="value max" disabled={!max_edit_modes.includes(characterController.mode)} onchange={() => siteState.save()} bind:value={max}/>
</div>
<style>
    .custom-title {
        
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