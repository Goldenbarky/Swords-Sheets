<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import EquipmentPage from '$lib/Pages/CharacterSheet/EquipmentPage.svelte';
    import FeaturesPage from "$lib/Pages/CharacterSheet/FeaturesPage.svelte";
    import SpellcastingPage from "$lib/Pages/CharacterSheet/SpellcastingPage.svelte";
    import StatsPage from "$lib/Pages/CharacterSheet/StatsPage.svelte";
    import ThemePage from '../ThemePage.svelte';
    import { fade } from 'svelte/transition';
    import CampaignInfo from '$lib/Components/CampaignInfo.svelte';
    import { DatabaseClient, SiteState } from '$lib/Database.svelte';

    let { spells } = $props();

    function save() {
        siteState.save();
    }

    let campaignInfoShown = $state(false);

    let tabs = ["Stats", "Features", "Equipment", "Spellcasting", "Theme"];
    let tabParam = $page.url.searchParams.get('activetab');
    let activeTab = $state(tabParam ?? "Stats");

    const dbClient = DatabaseClient.getDatabaseClient();
    const siteState = SiteState.getSiteState();
    const characterController = $derived(siteState.characterController!);
    const sheet = $derived(characterController.character);
</script>
<section class="hero is-small">
    <div
        class="hero-body"
        style="padding-bottom: 0px; padding-top: 0.5rem; background-color: var(--primary); border-bottom: 1px solid var(--border);"
    >
        <div class="columns" style="margin: 0">
            <div class="column custom-column" style="padding: 0;">
                {#if characterController.mode !== "edit"}
                    <p class="title custom-title" style="margin-bottom: 1.5rem;">{sheet.data.Name}</p>
                    <p class="subtitle" style="color: var(--text);">{sheet.data.Class} {sheet.data.Level}</p>
                {:else}
                    <p class="title custom-title placeholder" style="margin-bottom: 0.25rem;" onfocusout={save} bind:innerText={sheet.data.Name} contenteditable="true" placeholder="Name"></p>
                    <div class="row">
                        <p class="subtitle placeholder" onfocusout={save} bind:innerText={sheet.data.Class} contenteditable="true" placeholder="Class"></p>
                        <div style="width: 0.35rem;"></div>
                        <p class="subtitle placeholder" onfocusout={save} bind:innerText={sheet.data.Level} contenteditable="true" placeholder="Level"></p>
                    </div>
                {/if}
            </div>
            <div class="column custom-column" style="flex: none;">
                <div style="display: flex; flex-direction: column;">
                    <button class="custom-box custom-button" onclick={() => goto(`/`)}>Go Home</button>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <button class="custom-box custom-button" onclick={() => campaignInfoShown = true}>Campaign Info</button>
                </div>
            </div>
            <div class="column custom-column" style="flex: none;">
                <div style="display: flex; flex-direction: column;">
                    <button class="custom-box custom-button {characterController.mode === "view" ? "selected" : ""}" onclick={() => goto(`/${sheet.name}/?activetab=${activeTab}`)}>View</button>
                    {#if dbClient.user && sheet.owner_id === dbClient.user.id}
                        <button class="custom-box custom-button {characterController.mode === "use" ? "selected" : ""}" onclick={() => goto(`/${sheet.name}/use?activetab=${activeTab}`)}>Use</button>
                        <button class="custom-box custom-button {characterController.mode === "edit" ? "selected" : ""}" onclick={() => goto(`/${sheet.name}/edit?activetab=${activeTab}`)}>Edit</button>
                    {/if}
                </div>
            </div>
            <div class="column custom-column" style="flex: none;">
                {#if !dbClient.user}
                    <button class="custom-box custom-button" 
                        onclick={() => dbClient.signInWithGoogle()}>
                        Log in
                    </button>
                {:else}
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <img src={dbClient.user.user_metadata.avatar_url} referrerpolicy="no-referrer" class="profile-pic"/>
                {/if}
            </div>
        </div>
        <div class="custom-tabs is-boxed">
            <ul style="display: flex; flex-direction: row;">
                {#each tabs as tab}
                    {#if tab !== "Theme" || characterController.mode === "edit"}
                        <li class:is-active={activeTab===tab}>
                            <!-- svelte-ignore a11y_missing_attribute, a11y_no_static_element_interactions, a11y_click_events_have_key_events-->
                            <a onclick={() => {
                                activeTab = tab;
                                goto(`/${sheet.name}/${characterController.mode === "view" ? "" : characterController.mode }?activetab=${tab}`);
                            }}>{tab}</a>
                        </li>
                    {/if}
                {/each}
            </ul>
        </div>
    </div>
</section>
{#if activeTab==="Stats"}
    <StatsPage
        bind:character={sheet.data}
    />
{:else if activeTab==="Features"}
    <FeaturesPage
        bind:character={sheet.data}
    />
{:else if activeTab==="Equipment"}
    <EquipmentPage
        bind:character={sheet.data}
    />
{:else if activeTab==="Spellcasting"}
    <SpellcastingPage
        bind:character={sheet.data}
        spells={spells}
    />
{:else if activeTab==="Notes"}
    <div>words</div>
{:else if activeTab==="Theme"}
    {#if characterController.mode === "edit"}
        <ThemePage/>
    {/if}
{/if}

<CampaignInfo bind:shown={campaignInfoShown} />

<!-- tODO fix  -->
{#key siteState.saveStatus !== 'NOT'}
    <div class="save-indicator" out:fade={{ delay: 1000 }}>
        {#if siteState.saveStatus === 'SAVING'}
            <div class="save-saving">
                
            </div>
        {:else if siteState.saveStatus === 'SUCCEEDED'}
            <div class="save-saved">
                
            </div>
        {:else}
            <div class="save-errored">
                
            </div>
        {/if}
    </div>
{/key}
<style lang="scss">
    .save-indicator {
        position: absolute;
        width: 2rem;
        height: 2rem;
        border-radius: 25px;
        overflow: clip;
        border: solid black 2px;
        top: 20px;
        left: 50%;
        color: black;
        opacity: 1;
        transition: background-color 0.5s ease-in, opacity 1s ease-in;
    }
    .save-indicator:has(.save-saving) {
        opacity: 1;
        background-color: yellow;
    }
    .save-indicator:has(.save-saved) {
        opacity: 0;
        background-color: green;
    }
    .save-indicator:has(.save-errored) {
        opacity: 0;
        background-color: red;
    }
    .custom-title {
        color: white;
        margin:0;
    }
    .subtitle {
        color: var(--text);
        margin-bottom: 1.7rem;   
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
    .selected {
        border-color: var(--secondary);
        color: var(--secondary);
    }
    .profile-pic {
        width: 5rem;
        height: 5rem;
        border-radius: 999px;
        border: 2px solid var(--text);
        user-select: none;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
</style>