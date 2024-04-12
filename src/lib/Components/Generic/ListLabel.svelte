<script lang="ts">
    import { updateDatabase } from "$lib/GenericFunctions";
    import { mode } from "$lib/Theme";
    import Divider from "../Helpers/Divider.svelte";

    export let label:string;
    export let list:string[];
</script>
    <div class="row" style="margin:0.5rem;">
        <div class="custom-title">{label}</div>
        <Divider/>
        <div class="list">
            {#if $mode === "edit"}
                {#each list as item}
                    <div class="row">
                        <button class="custom-box custom-button custom-tiny-button" on:click={() => {
                            list = list.filter(x => x !== item);
                            updateDatabase();
                        }}>-</button>
                        <input class="item" on:change={updateDatabase} bind:value={item} placeholder="New {label}"/>
                    </div>
                {/each}
                <button class="custom-box custom-button" on:click={() => list = [...list, ""]}>+</button>
            {:else}
                {#each list as item}
                    <div style="cursor: default;">{item}</div>
                {/each}
            {/if}
        </div>
    </div>
<style lang="scss">
    .custom-title {
        @extend .title !optional;
        font-size: medium;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align:center;
        width: 6rem;
        color: var(--secondary);
    }
    .row {
        display: flex;
        flex-direction: row;
    }
    .list {
        font-size: medium;
        text-wrap: nowrap;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: calc(100% - 7rem);
        color: var(--text);
    }
    .item {
        all: unset;
        width: 100%;
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
</style>