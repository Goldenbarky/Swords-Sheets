<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { setCharacter, signInWithGoogle, updateDatabase, updateName } from '$lib/GenericFunctions';
    import EquipmentPage from '$lib/Pages/EquipmentPage.svelte';
    import FeaturesPage from "$lib/Pages/FeaturesPage.svelte";
    import SpellcastingPage from "$lib/Pages/SpellcastingPage.svelte";
    import StatsPage from "$lib/Pages/StatsPage.svelte";
    import { mode } from '$lib/Theme';
    import type { User } from '@supabase/supabase-js';
    import { getContext, onMount } from 'svelte';
    import ThemePage from './ThemePage.svelte';

    export let sheet:any;
    export let spells:any;

    let user: User | undefined = getContext<{ user: User | undefined }>('user').user;

    onMount(async () => {
        setCharacter(sheet);
    });


    let tabs = ["Stats", "Features", "Equipment", "Spellcasting", "Notes", "Theme"];
    let tabParam = $page.url.searchParams.get('activetab');
    let activeTab = tabParam ?? "Stats";
</script>
<section class="hero is-small">
    <div
        class="hero-body"
        style="padding-bottom: 0px; padding-top: 0.5rem; background-color: var(--primary); border-bottom: 1px solid var(--border);"
    >
        <div class="columns" style="margin: 0">
            <div class="column custom-column" style="padding: 0;">
                {#if $mode !== "edit"}
                    <p class="title custom-title" style="margin-bottom: 1.5rem;">{sheet.name}</p>
                    <p class="subtitle" style="color: var(--text);">{sheet.data.Class} {sheet.data.Level}</p>
                {:else}
                    <p class="title custom-title placeholder" style="margin-bottom: 0.25rem;" on:focusout={updateName} bind:innerText={sheet.name} contenteditable="true" placeholder="Name"/>
                    <div class="row">
                        <p class="subtitle placeholder" on:focusout={updateDatabase} bind:innerText={sheet.data.Class} contenteditable="true" placeholder="Class"/>
                        <div style="width: 0.35rem;"/>
                        <p class="subtitle placeholder" on:focusout={updateDatabase} bind:innerText={sheet.data.Level} contenteditable="true" placeholder="Level"/>
                    </div>
                {/if}
            </div>
            <div class="column custom-column" style="flex: none;">
                <div style="display: flex; flex-direction: column;">
                    <button class="custom-box custom-button {$mode === "view" ? "selected" : ""}" on:click={() => goto(`/${sheet.name}/?activetab=${activeTab}`)}>View</button>
                    {#if user && sheet.owner_id === user.id}
                        <button class="custom-box custom-button {$mode === "use" ? "selected" : ""}" on:click={() => goto(`/${sheet.name}/use?activetab=${activeTab}`)}>Use</button>
                        <button class="custom-box custom-button {$mode === "edit" ? "selected" : ""}" on:click={() => goto(`/${sheet.name}/edit?activetab=${activeTab}`)}>Edit</button>
                    {/if}
                </div>
            </div>
            <div class="column custom-column" style="flex: none;">
                {#if !user}
                    <button class="custom-box custom-button" 
                        on:click={async () => await signInWithGoogle()}>
                        Log in
                    </button>
                {:else}
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <img src={user.user_metadata.avatar_url} class="profile-pic"/>
                {/if}
            </div>
        </div>
        <div class="custom-tabs is-boxed">
            <ul style="display: flex; flex-direction: row;">
                {#each tabs as tab}
                    {#if tab !== "Theme" || $mode === "edit"}
                        <li class:is-active={activeTab===tab}>
                            <!-- svelte-ignore a11y-missing-attribute a11y-no-static-element-interactions a11y-click-events-have-key-events-->
                            <a on:click={() => {
                                activeTab = tab;
                                goto(`/${sheet.name}/${$mode === "view" ? "" : $mode }?activetab=${tab}`);
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
        character={sheet.data}
    />
{:else if activeTab==="Features"}
    <FeaturesPage
        character={sheet.data}
    />
{:else if activeTab==="Equipment"}
    <EquipmentPage
        character={sheet.data}
    />
{:else if activeTab==="Spellcasting"}
    <SpellcastingPage
        spells={spells}
        character={sheet.data}
    />
{:else if activeTab==="Notes"}
    <div>words</div>
{:else if activeTab==="Theme"}
    {#if $mode === "edit"}
        <ThemePage/>
    {/if}
{/if}
<style lang="scss">
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
        border-radius: 999px;
        border: 2px solid var(--text);
        user-select: none;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
</style>