<script lang="ts">
    import {
        getUserNames,
        getUsersCampaigns,
        getUsersCharacters,
        supabaseObject,
        user as writeUser,
    } from "$lib/GenericFunctions";
    import "$lib/../app.scss";
    import CharacterPreview from "$lib/Components/Generic/CharacterPreview.svelte";
    import { onMount } from "svelte";
    import Login from "$lib/Components/Server/Login.svelte";
    import CreateCharacter from "$lib/Components/CreateCharacter.svelte";
    import CreateCampaign from "$lib/Components/CreateCampaign.svelte";
    import CampaignPreview from "$lib/Components/Generic/CampaignPreview.svelte";

    export let data;

    let activeTab: string = "";

    let users: any[];
    let characters: CharacterDataRow[];
    let campaigns:CampaignDataRow[];

    let characterModal = false;
    let campaignModal = false;

    onMount(() => {
        supabaseObject(data.supabase);
        getUserNames().then((s) => {
            if (!s) return;
            users = s;
        });

        getUsersCharacters().then((s) => (characters = s!));
        getUsersCampaigns().then((s) => (campaigns = s!));
    });

    $: user = $writeUser ?? data.user;
    $: userAuthorized = user ? users?.find((x) => x.id === user.id) : false;
    $: filteredCharacters = characters?.filter((x) => x.owner_id === activeTab);
    $: filteredCampaigns = campaigns?.filter((x) => x.owner_id === activeTab);
</script>

<div>
    <section class="hero is-small">
        <div class="hero-body hero">
            <div class="columns" style="margin: 0">
                <div class="column custom-column" style="padding: 0;">
                    <p class="title" style="color: white">Swords & Sheets</p>
                    <p class="subtitle" style="color: var(--text);">
                        Isabelle's Favorite Character Sheet Creator
                    </p>
                </div>
                <div class="column custom-column" style="flex: none;">
                    {#if user}
                        <button
                            class="custom-box custom-button"
                            on:click={async () => {
                                characterModal = true;
                            }}
                        >
                            Create New Character
                        </button>
                        <button
                            class="custom-box custom-button"
                            on:click={async () => {
                                campaignModal = true;
                            }}
                        >
                            Create New Campaign
                        </button>
                    {/if}
                </div>
                <Login
                    user={user}
                />
            </div>
            <div class="custom-tabs is-boxed">
                <ul style="display: flex; flex-direction: row; height: 41px">
                    {#if users}
                        {#each users.sort((a, b) => a.display_name.localeCompare(b.display_name)) as tab}
                            <li class:is-active={activeTab === tab.id}>
                                <!-- svelte-ignore a11y-missing-attribute a11y-no-static-element-interactions a11y-click-events-have-key-events-->
                                <a
                                    on:click={() => {
                                        activeTab = tab.id;
                                    }}
                                >
                                    {tab.display_name}
                                </a>
                            </li>
                        {/each}
                    {/if}
                </ul>
            </div>
        </div>
    </section>
</div>
{#if activeTab}
    <div style="height: 0.5rem;"/>
    {#if filteredCampaigns.length > 0}
        <div class="row">
            <div class="custom-title">Campaigns</div>
        </div>
        <div class="grid">
                {#each filteredCampaigns as campaign}
                    <CampaignPreview
                        campaign={campaign}
                    />
                {/each}
        </div>
    {/if}
    {#if filteredCharacters}
        <div class="row">
            <div class="custom-title">Characters</div>
        </div>
        <div class="grid">
            
                {#each filteredCharacters as character}
                    <CharacterPreview
                        character={character}
                    />
                {/each}
        </div>
    {/if}
{/if}
<CreateCharacter
    userAuthorized={userAuthorized}
    bind:shown={characterModal}
/>
{#if characters}
    <CreateCampaign
        userAuthorized={userAuthorized}
        bind:shown={campaignModal}
        all_characters={characters}
    />
{/if}
<style lang="scss">
    :root {
        --background: #1b1919;
        --background_hover: #2f2f2f;
        --primary: #8f0002;
        --secondary: #C62F31;
        --border: #adadad;
        --text: #adadad;
    }
    :global(body) {
        width: 100vw;
        height: 100vh;
        background-color: var(--background);
    }
    .hero {
        padding-bottom: 0px !important;
        padding-top: 0.5rem !important;
        background-color: var(--primary);
        border-bottom: 1px solid var(--border);
    }
    .custom-box {
        border: 2px solid var(--border);
        padding: 0.75rem;
        padding-top: 0rem;
        background-color: var(--background);
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 6px;
        box-shadow:
            0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
            0 0px 0 1px rgba(10, 10, 10, 0.02);
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
        position: relative;
        top: 1px;
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
    .row {
        display: flex;
        flex-direction: row;
        padding-left: 1rem;
    }
    .column {
        display: flex;
        flex-direction: column;
    }
    .grid {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        gap: 0.5rem;
        padding: 1rem;
    }
    .custom-title {
        @extend .title !optional;
        width: fit-content;
        font-size: x-large;
        justify-content: center;
        text-align: center;
        font-weight: bold;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid var(--border);
        color: var(--secondary);
        user-select: none;
        cursor: default;
    }
</style>
