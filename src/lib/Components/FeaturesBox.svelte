<script lang="ts">
    import TitleDescription from "$lib/Components/Generic/TitleDescription.svelte";
    import { updateDatabase } from "$lib/GenericFunctions";
    import { mode } from "$lib/Theme";
    import DraggableHandle from '$lib/Components/Icons/DraggableHandle.svelte';
    import { SOURCES, dndzone } from "svelte-dnd-action";
    import ToggleSwitch from "./Generic/ToggleSwitch.svelte";

    export let title:string;
    export let features:{Title:string, Description:{Subtitle:string, Paragraph:string}[]}[];

    let reorderable = false;

    const removeFeature = (list:{Title:string, Description:{Subtitle:string, Paragraph:string}[]}[], title:string) => {
        return list.filter(x => x.Title !== title);
    }

</script>

<div class="box custom-box">
    <div class="custom-title">{title}</div>
    {#each features as feature, i (feature)}
        <TitleDescription
            bind:title={feature.Title}
            bind:description={feature.Description}
            removeFunction={() => features = removeFeature(features, feature.Title)}
            orderable={reorderable}
        />
        <div style="height:0.5rem;"/>
    {/each}
    {#if $mode === "edit"}
        <div class="row">
            <button 
                class="custom-box custom-button custom-tiny-button" 
                style="margin-top:0.5rem;" 
                on:click={async () => {
                    features = [...features, {Title:"", Description:[{Subtitle:"", Paragraph:""}]}];
                    await updateDatabase();
                }}
            >
                +
            </button>
            <div>
                <div style="width:100%;">
                    <div class="custom-subtitle placeholder" on:focusout={updateDatabase}>New Feature</div>
                </div>
            </div>
        </div>
        <div style="margin-top: 10px;">
            <ToggleSwitch
                title="Reorder?"
                bind:toggle={reorderable}
            />
        </div>
    {/if}
</div>

<style lang="scss">
    .custom-title {
        @extend .title !optional;
        font-size: x-large;
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
        text-align: left;
        width: fit-content;
        border-bottom: 1px solid var(--border);
        color: var(--secondary);
        cursor: default;
        user-select: none;
    }
    .custom-box {
        border: 2px solid var(--border);
        padding: 0.75rem;
        padding-top: 0rem;
        background-color: var(--background);
    }
    .row {
        display: flex;
        flex-direction: row;
        align-items: center;
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