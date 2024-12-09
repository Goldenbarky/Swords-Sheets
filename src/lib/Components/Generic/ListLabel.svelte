<script lang="ts">
    import { CharacterController, SiteState } from "$lib/Database.svelte";
    import Divider from "../Helpers/Divider.svelte";


    interface Props {
        label: string;
        list: string[];
        editable?: boolean;
    }

    let { label, list = $bindable(), editable = true }: Props = $props();

    const siteState = SiteState.getContext();
    const characterController = CharacterController.getContext();
</script>
<div class="row" style="margin:0.5rem; width: 100%;">
    <div class="custom-title">{label}</div>
    <Divider/>
    <div class="list">
        {#if editable && characterController.mode === "edit"}
            {#each list as item, i (item)}
                <div class="row">
                    <button class="custom-box custom-button custom-tiny-button" onclick={() => {
                        list = list.filter(x => x !== item);
                        siteState.save();
                    }}>-</button>
                    <input class="item" onchange={() => siteState.save()} bind:value={list[i]} placeholder="New {label}"/>
                </div>
            {/each}
            <button class="custom-box custom-button" onclick={() => list.push("")}>+</button>
        {:else}
            {#each list as item (item)}
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