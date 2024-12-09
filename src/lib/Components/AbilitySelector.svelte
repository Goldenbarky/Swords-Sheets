<script lang="ts">
    import { SiteState } from "$lib/Database.svelte";
    import DropDownArrow from "./Generic/DropDownArrow.svelte";

    interface Props {
        category_name: string;
        selected_ability: keyof AbilityScoreType;
        onChange?: Function;
        z_index?: number;
    }

    let {
        category_name,
        selected_ability = $bindable(),
        onChange = () => {},
        z_index = 1
    }: Props = $props();

    let abilities = [
        "Strength",
        "Dexterity",
        "Constitution",
        "Intelligence",
        "Wisdom",
        "Charisma",
    ] as (keyof AbilityScoreType)[];

    let shown = $state(false);

    const siteState = SiteState.getContext();
</script>

<div style="width: 100%; height: 1.2rem; position:absolute; z-index:{z_index}; bottom: -1px; display:flex; flex-direction:column; place-items:center;">
    <DropDownArrow
        bind:shown = {shown}
    />
    <div class="custom-box dropdown" style="{shown ? "" : "visibility: hidden; pointer-events: none"}">
        <div class="column">
            <div class="custom-title">{category_name} Ability</div>
            {#each abilities as ability (ability)}
                <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                <div class="custom-subtitle {ability === selected_ability ? "selected" : ""}" onclick={() => {
                    selected_ability = ability;
                    siteState.save();
                    onChange();
                }}>{ability}</div>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    .custom-title {
        @extend .title !optional;
        font-size: large;
        justify-content: center;
        text-align: center;
        font-weight: bold;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid var(--border);
        color: var(--secondary);
    }
    .custom-subtitle {
        @extend .title !optional;
        font-size: large;
        width: fit-content;
        color: var(--text);
        text-align: left;
        cursor: pointer;
    }
    .dropdown {
        width: 85%;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
        border-top: 0px;
        top: 2px;
    }
    .selected {
        color: var(--secondary);
    }
    .column {
        display: flex;
        flex-direction: column;
        padding: 0px;
        align-items: center;
    }
    
</style>