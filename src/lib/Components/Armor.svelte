<script lang="ts">
    import { CharacterController, SiteState } from "$lib/Database.svelte";
    import AbilitySelector from "./AbilitySelector.svelte";
    import NumberLabel from "./Generic/NumberLabel.svelte";

    interface Props {
        armor: Armor;
        z_index: number;
    }

    let { armor = $bindable(), z_index }: Props = $props();
    
    const siteState = SiteState.getContext();
    const characterController = CharacterController.getContext();
</script>
<div style="position: relative; width:100%;">
    <div class="custom-box">
        <input class="custom-title {characterController?.mode === "edit" ? 'editable' : ''}" disabled={characterController?.mode !== "edit"} onchange={() => siteState.save()} bind:value={armor.Name} placeholder={"Armor"}/>
        <div>
            <NumberLabel
                bind:number={armor.Base}
                label="Base"
                bold_label={false}
                number_edit_modes={["edit"]}
                label_font_size="medium"
            />
            {#if characterController?.mode === "edit" || Number(armor.Limit) !== 0}
                <NumberLabel
                    bind:number={armor.Limit}
                    label={`${armor.Ability} Max`}
                    bold_label={false}
                    number_edit_modes={["edit"]}
                    label_font_size="medium"
                />
            {/if}
        </div>
    </div>
    {#if characterController?.mode === "edit"}
        <AbilitySelector
            category_name = "AC"
            bind:selected_ability = {armor.Ability}
            z_index = {z_index}
        />
    {/if}
    <div style="display: flex; flex-direction: column; position: absolute; right: -19px; top: 0;">
        {#each [0, 1, 2, 3] as item_bonus}
            {#if armor.Bonus === item_bonus && item_bonus !== 0}
                <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                <div class="custom-box custom-side-tab {item_bonus === armor.Bonus ? "selected" : ""}" style="cursor: default;">+{item_bonus}</div>
            {:else if characterController?.mode === "edit"}
                <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                <div class="custom-box custom-side-tab {item_bonus === armor.Bonus ? "selected" : ""}" onclick={() => {
                    armor.Bonus = item_bonus;
                    siteState.save();
                }}>+{item_bonus}</div>
            {/if}
        {/each}
    </div>
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
    .custom-side-tab {
        font-size: x-small;
        padding: 0.15rem;
        margin: 0px;
        margin-top: 0.45rem;
        border-radius: 0px 6px 6px 0px;
        border-left: 0px;
        color: var(--text);
        cursor: pointer;
        user-select: none;
    }
    .selected {
        border-color: var(--secondary);
        color: var(--secondary);
    }
    input {
        all: unset;
    }
</style>