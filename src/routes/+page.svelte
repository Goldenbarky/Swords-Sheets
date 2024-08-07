<script lang="ts">
    import {
        getUserNames,
        getUsersCharacters,
        supabaseObject,
        upsertNewCharacter,
        signInWithGoogle,
        user as writeUser,
    } from "$lib/GenericFunctions";
    import "../app.scss";
    import { goto } from "$app/navigation";
    import CharacterPreview from "$lib/Components/Generic/CharacterPreview.svelte";
    import { onMount } from "svelte";

    export let data;

    let activeTab: string = "";

    let userNames: string[];
    let users: any[];
    let characters: any[];

    let character_name: string;
    let character_level: number;
    let character_class: string;

    let shown = false;

    onMount(() => {
        supabaseObject(data.supabase);
        getUserNames().then((s) => {
            if (!s) return;
            users = s;
            userNames = users.map((x) => x.display_name).sort();
        });

        getUsersCharacters().then((s) => (characters = s!));
    });

    $: user = $writeUser ?? data.user;
    $: userAuthorized = user ? users?.find((x) => x.id === user.id) : false;
    $: filteredCharacters = characters?.filter((x) => x.owner_id === activeTab);
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
                                shown = true;
                            }}
                        >
                            Create New Character
                        </button>
                    {/if}
                </div>
                <div class="column custom-column" style="flex: none;">
                    {#if !user}
                        <button
                            class="custom-box custom-button"
                            on:click={async () => {
                                await signInWithGoogle();
                            }}
                        >
                            Log in
                        </button>
                    {:else}
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <img
                            src={user.user_metadata.avatar_url}
                            class="profile-pic"
                        />
                    {/if}
                </div>
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
<div class="grid">
    {#if filteredCharacters}
        {#each filteredCharacters as character}
            <CharacterPreview
                name={character.name}
                character_class={character.data.Class}
                level={character.data.Level}
                primary_color={character.theme
                    ? character.theme.primary
                    : "#8F0002"}
            />
        {/each}
    {/if}
</div>
<div class="modal {shown ? 'is-active' : ''}">
    <!-- svelte-ignore a11y-missing-attribute a11y-no-static-element-interactions a11y-click-events-have-key-events-->
    <div
        class="modal-background"
        on:click={() => {
            shown = false;
        }}
    />
    <div class="modal-content" style="display: grid; align-items: center; justify-items: center;">
        <div class="custom-box column" style="width: fit-content; height: fit-content;">
            <div class="custom-title">Make a New Character</div>
            <div class="row">
                <div class="custom-subtitle">Name</div>
                <div class="spell-detail custom-button">?
                    <div class="box tooltip-box">
                        <div class="tooltip-text">
                            This will be the URI to your character sheet, it must be unique but can be changed later. There is also an option to add a display name for the top of the sheet, so it's best to choose something short and representative here.
                        </div>
                    </div>
                </div>
            </div>
            <input bind:value={character_name} maxlength="25"/>
            <div class="row">
                <div
                    class="column"
                    style="padding-left: 0px; padding-right: 0px;"
                >
                    <div class="custom-subtitle">Class</div>
                    <input
                        list="classes"
                        name="myClass"
                        type="search"
                        bind:value={character_class}
                    />
                    <datalist id="classes">
                        <option value="Artificer" />
                        <option value="Barbarian" />
                        <option value="Bard" />
                        <option value="Cleric" />
                        <option value="Druid" />
                        <option value="Fighter" />
                        <option value="Monk" />
                        <option value="Paladin" />
                        <option value="Ranger" />
                        <option value="Rogue" />
                        <option value="Sorcerer" />
                        <option value="Warlock" />
                        <option value="Wizard" />
                    </datalist>
                </div>
                <div style="width: 1rem;" />
                <div
                    class="column"
                    style="padding-left: 0px; padding-right: 0px;"
                >
                    <div class="custom-subtitle">Level</div>
                    <input
                        type="number"
                        id="level"
                        min="1"
                        max="20"
                        bind:value={character_level}
                    />
                </div>
            </div>
            <button
                class="custom-box custom-button {!userAuthorized
                    ? 'disabled'
                    : ''}"
                style="border: solid 1px var(--border);"
                on:click={async () => {
                    if (userAuthorized) {
                        await upsertNewCharacter(character_class, character_level, character_name);
                        goto(
                            `https://justin.pakj.games/${character_name}/edit`,
                        );
                    }
                }}
            >
                Create Character
            </button>
        </div>
    </div>
</div>

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
    .modal {
        position: absolute;
        width: 100vw;
        height: 100vh;
    }
    .custom-title {
        @extend .title !optional;
        font-size: x-large;
        justify-content: center;
        text-align: center;
        font-weight: bold;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid var(--border);
        color: var(--text);
        width: 100%;
    }
    .custom-subtitle {
        @extend .title !optional;
        font-size: large;
        text-align: left;
        width: fit-content;
        border-bottom: 1px solid var(--border);
        color: var(--text);
        margin-bottom: 0.5rem;
        width: 100%;
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
    }
    .column {
        display: flex;
        flex-direction: column;
    }
    input {
        all: unset;
        border: 1px solid var(--border);
        border-radius: 6px;
        backdrop-filter: brightness(75%);
        width: 95%;
        color: var(--text);
        padding-left: 5px;
    }
    .profile-pic {
        width: 5rem;
        border-radius: 999px;
        border: 2px solid var(--text);
        user-select: none;
    }
    .grid {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        gap: 0.5rem;
        padding: 1rem;
    }
    .disabled {
        cursor: not-allowed;
    }

    .spell-detail{
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
        text-align: center;
        padding-bottom: 1px;
        margin-left: 0.5rem;
        color: var(--secondary);
        user-select: none;
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
        margin-top: 5px;
        z-index: 1;
    }
    .tooltip-text {
        visibility: hidden;
        text-align: center;
        width: 15rem;
        color: var(--text);
    }
    .spell-detail:hover .tooltip-box {
        visibility: visible;
    }
    .spell-detail:hover .tooltip-text {
        visibility: visible;
    }
</style>
