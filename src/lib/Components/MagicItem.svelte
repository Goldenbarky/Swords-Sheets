<script lang="ts">
    import { CharacterController, SiteState } from "$lib/Database.svelte";
    import FeaturesBox from "./FeaturesBox.svelte";

    interface Props {
        item: MagicItem;
        removeFunction: Function;
    }

    let { item = $bindable(), removeFunction }: Props = $props();

    let shown:boolean = $state(false);

    const siteState = SiteState.getContext();
    const characterController = CharacterController.getContext();
</script>
<div class="container" style="margin-bottom:0.5rem; flex:none;">
    <div class="custom-box">
        <div class="row" style="width: 100%;">
            <input class="custom-subtitle {characterController.mode === "edit" ? 'editable' : ''}" disabled={characterController.mode !== "edit"} onchange={() => siteState.save()} bind:value={item.Name} placeholder={"New Magic Item"}/>
            {#if characterController.mode === "edit" || item.Attuned}
                <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                <div class="attuned {item.Attuned ? "selected" : ""} {characterController.mode === "edit" ? "attuned-hover" : ""}" onclick={() => { 
                    if(characterController.mode === "edit") {
                        item.Attuned = !item.Attuned; 
                        siteState.save();
                    }
                }}>A
                    <div class="box tooltip-box">
                        <div class="tooltip-text">
                            Attuned
                        </div>
                    </div>
                </div>
            {/if}
            {#if characterController.mode === "edit"}
                <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                <div class="attuned selected attuned-hover" onclick={() => removeFunction()}>X
                    <div class="box tooltip-box">
                        <div class="tooltip-text">Delete Item</div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
    {#if shown}
        <div class="dropdown">
            <FeaturesBox
                title="Features"
                features={item.Entries}
            />
        </div>
    {/if}
    {#if characterController.mode === "edit" || item.Entries.length > 0}
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions-->
        <div class="custom-box bubble" onclick={() => {
            shown = !shown
            }}>
            <div style="margin-top: -0.6rem; user-select: none">
                {shown ? "-" : "+"}
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .custom-subtitle {
        @extend .title !optional;
        font-size: large;
        text-align: left;
        width: 100%;
        color: var(--secondary);
    }
    .custom-box {
        padding: 0.5rem;
        width: 100%;
    }
    .row {
        display: flex;
        flex-direction: row;
        place-content: space-between;
        align-items: center;
    }
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: fit-content;
        width: 100%;
    }
    .attuned{
        outline: 1.5px solid var(--border);
        border-radius: 35%;
        width: 1.2rem;
        height: 1.2rem;
        font-size: small;
        font-weight: 500;
        display: inline-block;
        justify-items: center;
        justify-content: center;
        align-items: center;
        padding-bottom: 1px;
        margin-left: 0.5rem;
        position: relative;
        cursor: default;
        user-select: none;
    }
    .selected {
        color: var(--secondary);
    }
    .attuned-hover:hover {
        background-color: var(--background_hover);
    }
    .tooltip-box {
        border: 2px solid var(--border);
        padding: 0.75rem;
        padding-bottom: 0.25rem;
        padding-top: 0.25rem;
        background-color: var(--background);
        height: fit-content;
        width: fit-content;
        margin-bottom: 0px;
        visibility: hidden;
        position: absolute;
        right: 1.5rem;
        top: -0.4rem;
        z-index: 1;
        text-wrap: nowrap;
    }
    .tooltip-text {
        visibility: hidden;
        text-align: right;
        color: var(--secondary)
    }
    .attuned:hover .tooltip-box {
        visibility: visible;
    }
    .attuned:hover .tooltip-text {
        visibility: visible;
    }
    .dropdown {
        width: 90%;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
        border-top: 0px;
    }
    .dropdown .custom-box {
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
        border-top: 0px;
    }
    .bubble {
        border: 2px solid var(--border);
        border-radius: 999px;
        border-top-right-radius: 0px;
        border-top-left-radius: 0px;
        border-top-color: var(--background);
        padding: 0px;
        background-color: var(--background);
        width: 1.2rem;
        height: 1rem;
    }
    input {
        all: unset;
    }
</style>