<script lang="ts">
    import TitleDescription from "$lib/Components/Generic/TitleDescription.svelte";
    import { CharacterController, SiteState } from "$lib/Database.svelte";
    import ToggleSwitch from "./Generic/ToggleSwitch.svelte";

    interface Props {
        title: string;
        features: TitleDescriptionType[];
    }

    let { title, features = $bindable() }: Props = $props();

    let reorderable = $state(false);

    const removeFeature = (list:TitleDescriptionType[], title:string) => {
        return list.filter(x => x.Title !== title);
    }

    const siteState = SiteState.getContext();
    const characterController = CharacterController.getContext();
</script>

<div class="custom-box">
    <div class="custom-title">{title}</div>
    {#each features as feature, i (feature)}
        <TitleDescription
            bind:feature={features[i]}
            removeFunction={() => features = removeFeature(features, feature.Title)}
            orderable={reorderable}
        />
        <div style="height:0.5rem;"></div>
    {/each}
    {#if characterController?.mode === "edit"}
        <div class="row">
            <button 
                class="custom-box custom-button custom-tiny-button" 
                style="margin-top:0.5rem;" 
                onclick={() => {
                    features.push({Title:"", Description:[{Subtitle:"", Paragraph:""}], Uses: {Max:0, Used:0}});
                    siteState.save();
                }}
            >
                +
            </button>
            <div>
                <div style="width:100%;">
                    <div class="custom-subtitle placeholder" onfocusout={() => siteState.save()}>New Feature</div>
                </div>
            </div>
        </div>
        <div style="margin-top: 10px;">
            <ToggleSwitch
                title="Reorder?"
                bind:toggle={reorderable}
                on_update={() => siteState.save()}
            />
        </div>
    {/if}
</div>

<style>
    .custom-title {
        
        font-size: x-large;
        justify-content: center;
        text-align: center;
        font-weight: bold;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid var(--border);
        color: var(--secondary);
    }
    .custom-subtitle {
        
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
        width: 100%;
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