<script lang="ts">
    import { getInvitesForCampaign, getUsersCharacters, levenshteinDistance, saveCampaign, updateDatabase } from "$lib/GenericFunctions";
    import { onMount } from "svelte";
    import Divider from "./Helpers/Divider.svelte";

    export let shown:boolean;
    export let campaign:CampaignDataRow;

    let all_characters:CharacterDataRow[] = [];

    let character_query = "";

    onMount(() => {
        getUsersCharacters().then((s) => (all_characters = s!));
    })

    $: filter_array = all_characters.filter(x => x.name.toLowerCase().includes(character_query.toLowerCase())).sort((a, b) => {
        return levenshteinDistance(a.name.toLowerCase(), character_query.toLowerCase()) - levenshteinDistance(b.name.toLowerCase(), character_query.toLowerCase());
    }).slice(0, 5);
</script>
<div class="modal {shown ? 'is-active' : ''}">
    <!-- svelte-ignore a11y-missing-attribute a11y-no-static-element-interactions a11y-click-events-have-key-events-->
    <div
        class="modal-background"
        on:click={() => {
            shown = false;
        }}
    />
    <div class="modal-content" style="display: grid; align-items: center; justify-items: center; overflow: visible;">
        <div class="custom-box column" style="width: fit-content; height: fit-content; min-width: 30rem; padding-right: 2rem; padding-left: 2rem;">
            <div class="custom-title">Campaign Name</div>
                <div class="custom-subtitle">Name</div>
            <input bind:value={campaign.name} maxlength="32"/>
            <div style="height: 1rem;"/>
            <div class="custom-subtitle">Characters</div>
            <!--
            <input bind:value={character_query}/>
                {#if character_query.length > 0}
                    <div style="position:relative;">
                        <div class="custom-box tooltip-box" style="min-width:10rem;">
                            {#each filter_array as character, i}
                                svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions
                                <div class="custom-button" style="font-size:medium; width:100%; text-align:center;" on:click={() => {
                                    if(!campaign.data.Characters.find(x => character.id === x)) {
                                        campaign.data.Characters = [...campaign.data.Characters, character.id];
                                        character_query = "";
                                    }
                                }}>{character.name}</div>
                                {#if i != filter_array.length - 1}
                                    <Divider
                                        orientation="horizontal"
                                    />
                                {/if}
                            {/each}
                        </div>
                    </div>
                {/if}
                <Divider
                    orientation="horizontal"
                />
                -->
                <table>
                    <tr>
                        <th>Character</th>
                        <th>Class</th>
                        <th>Level</th>
                        <th>Status</th>
                    </tr>
                    {#each campaign.data.Characters as character_id}
                    {@const actualCharacter = all_characters.find(x => x.id === character_id)}
                        <tr>
                            <td>
                                <button 
                                    class="custom-box custom-button custom-tiny-button" 
                                    style="position: absolute; left: -1.5rem; top: 0.5rem;"
                                    on:click={() => {
                                        campaign.data.Characters = campaign.data.Characters.filter(x => x != character_id);
                                        updateDatabase();
                                    }}>
                                    -
                                </button>
                                {actualCharacter?.name}
                            </td>
                            <td>{actualCharacter?.data.Class}</td>
                            <td style="text-align: center;">{actualCharacter?.data.Level}</td>
                            <td class="status-icon">
                                {#if actualCharacter?.data.Campaign}
                                    &#x2714;
                                    <div class="box tooltip-box">
                                        <div class="tooltip-text">Invite Accepted</div>
                                    </div>
                                {:else}
                                    &#x27F3;
                                    <div class="box tooltip-box">
                                        <div class="tooltip-text">Invite Pending</div>
                                    </div>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </table>
            <div style="height: 1rem;"/>
            <div class="custom-subtitle">Level</div>
            <input
                type="number"
                id="level"
                min="1"
                max="20"
                bind:value={campaign.data.Level}
            />
            <div style="height: 1rem;"/>
            <button
                class="custom-box custom-button"
                style="border: solid 1px var(--border);"
                on:click={async () => await saveCampaign()}
            >
                Create Campaign
            </button>
        </div>
    </div>
</div>

<style lang="scss">
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
        margin-top: 0.2rem;
        margin-right: 0.3rem;
    }
    .custom-button:hover {
        background-color: var(--background_hover);
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
    .status-icon {
        cursor: default;
        text-align: center;
        position: relative;
    }
    .tooltip-box {
        border: 2px solid var(--border);
        padding: 0.75rem;
        padding-bottom: 0.25rem;
        padding-top: 0.25rem;
        background-color: var(--background);
        height: fit-content;
        width: fit-content;
        visibility: hidden;
        position: absolute;
        z-index: 1;
        right: -8.5rem;
        top: 0rem;
    }
    .tooltip-text {
        visibility: hidden;
        text-align: right;
        color: var(--secondary)
    }
    .status-icon:hover .tooltip-text {
        visibility: visible;
    }
    .status-icon:hover .tooltip-box {
        visibility: visible;
    }
    table {
        width: calc(100% - 1rem);
    }
    table, th, td {
        color: var(--text);
        border: 1px solid var(--border);
        border-radius: 10px;
    }
    th, td {
        padding: 5px;
        position: relative;
        text-wrap: nowrap;
        text-overflow: ellipsis;
    }
</style>