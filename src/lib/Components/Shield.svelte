<script lang="ts">
    import { CharacterController, SiteState } from "$lib/Database.svelte";
    import DropDownArrow from "./Generic/DropDownArrow.svelte";
    import NumberLabel from "./Generic/NumberLabel.svelte";

    interface Props {
        shield: Shield;
        z_index: number;
    }

    let { shield = $bindable(), z_index }: Props = $props();

    let shown:boolean = $state(false);

    let abilities = [
        "Strength",
        "Dexterity",
        "Constitution",
        "Intelligence",
        "Wisdom",
        "Charisma",
    ] as (keyof AbilityScoreType)[];
    
    const siteState = SiteState.getContext();
    const characterController = CharacterController.getContext();
</script>
<div style="position: relative; width:100%;">
    <div class="custom-box" style="background-color: #00000000;">
        <input class="custom-title {characterController.mode === "edit" ? 'editable' : ''}" disabled={characterController.mode !== "edit"} onchange={() => siteState.save()} bind:value={shield.Name} placeholder={"Armor Enhancement"}/>
        <div>
            <NumberLabel
                bind:number={shield.Base}
                label="AC Bonus"
                bold_label={false}
                number_edit_modes={["edit"]}
                --width={"5rem;"}
                label_font_size="medium"
            />
        </div>
    </div>
    {#if characterController.mode === "edit"}
        <div style="display: flex; flex-direction: column; position: absolute; left: -19px; top: 6px;">
            {#each [0, 1] as item_bonus}
                {#if shield.Bonus === item_bonus && item_bonus !== 0}
                    <div class="custom-box custom-side-tab right {item_bonus === shield.Bonus ? "selected" : ""}" style="cursor: default;">+{item_bonus}</div>
                {:else if characterController.mode === "edit"}
                    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                    <div class="custom-box custom-side-tab left {item_bonus === shield.Bonus ? "selected" : ""}" onclick={() => {
                        shield.Bonus = item_bonus;
                        siteState.save();
                    }}>+{item_bonus}</div>
                {/if}
            {/each}
        </div>
        <div style="display: flex; flex-direction: column; position: absolute; right: -19px; top: 6px;">
            {#each [2, 3] as item_bonus}
                {#if shield.Bonus === item_bonus && item_bonus !== 0}
                    <div class="custom-box custom-side-tab right {item_bonus === shield.Bonus ? "selected" : ""}" style="cursor: default;">+{item_bonus}</div>
                {:else if characterController.mode === "edit"}
                    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                    <div class="custom-box custom-side-tab right {item_bonus === shield.Bonus ? "selected" : ""}" onclick={() => {
                        shield.Bonus = item_bonus;
                        siteState.save();
                    }}>+{item_bonus}</div>
                {/if}
            {/each}
        </div>
        <div style="width: 100%; height: 1.2rem; position:absolute; z-index:{z_index}; bottom: -1px; display:flex; flex-direction:column; place-items:center;">
            <DropDownArrow
                bind:shown = {shown}
            />
            <div class="custom-box dropdown" style="{shown ? "" : "visibility: hidden; pointer-events: none"}">
                <div class="custom-title" style="font-weight: bold;">Saving Throw Modifiers</div>
                <div class="row">
                    <div class="column" style="padding: 0;">
                        {#each abilities as ability}
                            <div class="custom-subtitle">{ability}</div>
                        {/each}
                    </div>
                    <div style="width: 1rem;"></div>
                    <div class="column" style="display: flex; flex-direction: column; justify-content: space-evenly; padding: 0;">
                        {#each abilities as ability}
                            <span class="bonus" style="width: 1.75rem;">
                                +<input style="width: 1rem;" onchange={() => siteState.save()} bind:value={shield.Saving_Throw_Mods[ability]} placeholder={"0"}/>
                            </span>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    {:else if shield.Bonus !== 0}
        <div style="display: flex; flex-direction: column; position: absolute; right: -19px; top: 0;">
                <div class="custom-box custom-side-tab right selected">+{shield.Bonus}</div>
        </div>
    {/if}
</div>

<style>
    .custom-title {
        
        font-size: large;
        text-align: center;
        width: fit-content;
        border-bottom: 1px solid var(--border);
        color: var(--secondary);
        margin-bottom: 0.5rem;
    }
    .custom-subtitle {
        
        font-size: medium;
        color: var(--text);
        text-align: center;
        cursor: pointer;
    }
    input { 
        all: unset;
    }
    .row {
        display: flex;
        flex-direction: row;
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
    .dropdown {
        width: 85%;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
        border-top: 0px;
        top: 2px;
    }
    .selected {
        border-color: var(--secondary);
        color: var(--secondary);
    }
    .bonus {
        width: 2rem;
        text-align: center;
        font-size: small;
        border-bottom: 1px solid var(--border);
        width: fit-content;
        color: var(--text);
        user-select: none;
        cursor: default;
    }
</style>