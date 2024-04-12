<script lang="ts">
    import { updateDatabase } from "$lib/GenericFunctions";
    import { mode } from "$lib/Theme";
    import NumberLabel from "./Generic/NumberLabel.svelte";

    export let shield:Shield;
</script>
<div style="position: relative; width:100%;">
    <div class="custom-box" style="padding-bottom:0px; background-color: #00000000;">
        <input class="custom-title {$mode === "edit" ? 'editable' : ''}" disabled={$mode !== "edit"} on:change={updateDatabase} bind:value={shield.Name} placeholder={"Armor Enhancement"}/>
        <div>
            <NumberLabel
                bind:number={shield.Base}
                label="AC Bonus"
                bold_label={false}
                number_edit_modes={["edit"]}
                --width={"5rem;"}
            />
        </div>
    </div>
    {#if $mode === "edit"}
        <div style="display: flex; flex-direction: column; position: absolute; left: -19px; top: 6px;">
            {#each [0, 1] as item_bonus}
                {#if $mode === "edit" || (shield.Bonus === item_bonus && item_bonus !== 0)}
                    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
                    <div class="custom-box custom-side-tab left {item_bonus === shield.Bonus ? "selected" : ""}" on:click={() => {
                        shield.Bonus = item_bonus;
                        updateDatabase();
                    }}>+{item_bonus}</div>
                {/if}
            {/each}
        </div>
        <div style="display: flex; flex-direction: column; position: absolute; right: -19px; top: 6px;">
            {#each [2, 3] as item_bonus}
                {#if $mode === "edit" || (shield.Bonus === item_bonus && item_bonus !== 0)}
                    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
                    <div class="custom-box custom-side-tab right {item_bonus === shield.Bonus ? "selected" : ""}" on:click={() => {
                        shield.Bonus = item_bonus;
                        updateDatabase();
                    }}>+{item_bonus}</div>
                {/if}
            {/each}
        </div>
    {:else if shield.Bonus !== 0}
        <div style="display: flex; flex-direction: column; position: absolute; right: -19px; top: 0;">
                <div class="custom-box custom-side-tab right selected">+{shield.Bonus}</div>
        </div>
    {/if}
    
</div>

<style lang="scss">
    .custom-title {
        @extend .title !optional;
        font-size: large;
        text-align: center;
        width: fit-content;
        border-bottom: 1px solid var(--border);
        color: var(--secondary);
        margin-bottom: 0.5rem;
    }
    input { 
        all: unset;
    }
    .custom-side-tab {
        font-size: x-small;
        padding: 0.15rem;
        margin: 0px;
        margin-top: 0.45rem;
        color: var(--text);
        cursor: pointer;
        user-select: none;
    }
    .left {
        border-radius: 6px 0px 0px 6px;
        border-right: 0px;
    }
    .right {
        border-left: 0px;
        border-radius: 0px 6px 6px 0px;
    }
    .selected {
        border-color: var(--secondary);
        color: var(--secondary);
    }
</style>