<script lang="ts">
    import { updateDatabase } from "$lib/GenericFunctions";
    import { mode } from "$lib/Theme";

    export let name:string;
    export let score:number;
    export let mod:string;
</script>

<div class="ability-box">
    <div class="box custom-box ability-score-box">
        <div class="ability-name">{name}</div>
        <input class="ability-score" disabled={$mode !== "edit"} on:change={updateDatabase} bind:value={score}/>
    </div>
    <div class="box custom-box ability-mod">{mod}</div>
</div>
<style lang="scss">
    .ability-box {
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-bottom: 10px;
    }
    .custom-box {
        border: 2px solid var(--border);
        padding: 0.75rem;
        padding-top: 0rem;
        background-color: var(--background);
    }
    .ability-name {
        text-align: center;
        font-weight: bold;
        color: var(--secondary);
        user-select: none;
    }
    .ability-score-box {
        position: relative;
        width: 10rem;
        border: 2px solid var(--border);
        padding: 10px;
        padding-bottom: 20px;
        color: var(--secondary);
    }
    .ability-score {
        all: unset;
        font-size: 2.5rem;
        width: 3rem;
    }
    .ability-mod {
        font-size: 1.5rem;
        margin-top: -45px;
        z-index: 1;
        width: 4rem;
        height: fit-content;
        text-align: center;
        padding: 0;
        border: 2px solid var(--border);
        color: var(--text);
        background-color: var(--background);
        cursor: default;
        user-select: none;
    }
</style>