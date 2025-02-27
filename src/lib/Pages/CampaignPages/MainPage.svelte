<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { CampaignController, DatabaseClient, SiteState } from '$lib/Database.svelte';
    import Login from '$lib/Components/Server/Login.svelte';
    import SummaryPage from './SummaryPage.svelte';
    import CombatPage from './CombatPage.svelte';
    import ThemePage from '../ThemePage.svelte';
    import "$lib/../app.css";
    import EditCampaign from '$lib/Components/EditCampaign.svelte';

    let characters:CharacterDataRow[] = $state([]);
    let edit_campaign = $state(false);

    const dbClient = DatabaseClient.getContext();
    const siteState = SiteState.getContext();
    const campaignController = CampaignController.getContext();
    
    $effect(() => {
        dbClient.getCharactersByIds(campaignController.campaign.data.Characters).then((s) => {
            if (!s) return;
            characters = s.filter(x => !!x.data.Campaign);
        });
    });

    let tabs = ["Summary", "Combat", "Theme"];
    let tabParam = $page.url.searchParams.get('activetab');
    let activeTab = $state(tabParam ?? "Summary");
</script>
<section class="hero is-small">
    <div
        class="hero-body"
        style="padding-bottom: 0px; padding-top: 0.5rem; background-color: var(--primary); border-bottom: 1px solid var(--border);"
    >
        <div class="columns" style="margin: 0">
            <div class="column custom-column" style="padding: 0;">
                <p class="title custom-title" style="margin-bottom: 1.5rem;">{campaignController.campaign.name}</p>
            </div>
            <div class="column custom-column" style="flex: none;">
                <div style="display: flex; flex-direction: column;">
                    <button class="custom-box custom-button" onclick={() => goto(`/`)}>Go Home</button>
                    <button class="custom-box custom-button" onclick={() => edit_campaign = true}>Edit Characters</button>
                </div>
            </div>
            <Login />
        </div>
        <div class="custom-tabs is-boxed">
            <ul style="display: flex; flex-direction: row;">
                {#each tabs as tab}
                    {#if tab !== "Theme" || campaignController.mode === "edit"}
                        <li class:is-active={activeTab===tab}>
                            <!-- svelte-ignore a11y_missing_attribute, a11y_no_static_element_interactions, a11y_click_events_have_key_events-->
                            <a onclick={() => {
                                activeTab = tab;
                                goto(`/campaign/${campaignController.campaign.id}/${campaignController.mode === "view" ? "" : campaignController.mode }?activetab=${tab}`);
                            }}>{tab}</a>
                        </li>
                    {/if}
                {/each}
            </ul>
        </div>
    </div>
</section>
{#if activeTab==="Summary"}
    <SummaryPage
        characters={characters}
    />
{:else if activeTab==="Combat"}
    <CombatPage/>
{:else if activeTab==="Theme"}
    {#if campaignController.mode === "edit"}
        <ThemePage/>
    {/if}
{/if}

<EditCampaign
    bind:shown={edit_campaign}
    bind:campaign={campaignController.campaign}
/>

<style>
    .custom-title {
        color: white;
        margin:0;
    }
    .custom-tabs {
        -webkit-overflow-scrolling: touch;
        align-items: stretch;
        display: flex;
        font-size: 1rem;
        justify-content: space-between;
        white-space: nowrap;
    }
    .custom-tabs.is-boxed li.is-active a {
        background-color: var(--background);
        border-color: var(--border);
        border-bottom-color: transparent !important;
    }
    .custom-tabs li.is-active a {
        border-bottom-color: hsl(229, 53%, 53%);
    }
    .custom-tabs.is-boxed a {
        border: 1px solid transparent;
        border-radius: 4px 4px 0 0;
    }
    .custom-tabs a {
        align-items: center;
        border-bottom-color: var(--border);
        border-bottom-style: solid;
        border-bottom-width: 1px;
        color: var(--text);
        display: flex;
        justify-content: center;
        margin-bottom: -1px;
        padding: 0.5em 1em;
        vertical-align: top;
    }
    .custom-button {
        padding-bottom: 2px;
        background-color: var(--background);
        color: var(--text);
        margin-bottom: 0.2rem;
        border: 0px;
        user-select: none;
        color: var(--text);
        font-size: small;
        cursor: pointer;
    }
    .custom-button:hover {
        background-color: var(--background_hover);
    }
    .custom-column {
        padding-top: 0;
        padding-bottom: 0;
    }
</style>