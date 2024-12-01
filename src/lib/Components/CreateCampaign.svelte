<script lang="ts">
    import { goto } from "$app/navigation";
    import { levenshteinDistance, upsertNewCampaign } from "$lib/GenericFunctions";
    import { onMount } from "svelte";
    import Divider from "./Helpers/Divider.svelte";

    export let userAuthorized;
    export let shown:boolean;
    export let all_characters:CharacterDataRow[];

    let campaign_name: string;
    let characters: string[] = [];
    let campaign_level: number;

    let character_query = "";

    onMount(() => {
        all_characters = all_characters.filter(x => !x.data.Campaign);
    });

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
            <div class="custom-title">Make a New Campaign</div>
                <div class="custom-subtitle">Name</div>
            <input bind:value={campaign_name} maxlength="32"/>
            <div style="height: 1rem;"/>
            <div class="custom-subtitle">Characters</div>
            <input bind:value={character_query}/>
                {#if character_query.length > 0}
                    <div style="position:relative; display: flex; justify-content: center;">
                        <div class="custom-box tooltip-box" style="min-width:10rem;">
                            {#each filter_array as character, i}
                                <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
                                <div class="custom-button" style="font-size:medium; width:100%; text-align:center;" on:click={() => {
                                    if(!characters.find(x => character.id === x)) {
                                        characters = [...characters, character.id];
                                        character_query = "";
                                    }
                                }}>{character.name}</div>
                                {#if i != filter_array.length - 1}
                                    <Divider
                                        orientation="horizontal"
                                    />
                                {/if}
                            {/each}
                            {#if filter_array.length <= 0}
                                No results
                            {/if}
                        </div>
                    </div>
                {/if}
                <Divider
                    orientation="horizontal"
                />
                <table>
                    <tbody>
                        <tr>
                            <th >Character</th>
                            <th>Class</th>
                            <th>Level</th>
                        </tr>
                        {#each characters as character_id}
                        {@const actualCharacter = all_characters.find(x => x.id === character_id)}
                            <tr>
                                <td>
                                    <button 
                                        class="custom-box custom-button custom-tiny-button" 
                                        style="position: absolute; left: -1.5rem; top: 0.5rem;"
                                        on:click={() => {
                                            characters = characters.filter(x => x != character_id)
                                        }}>
                                        -
                                    </button>
                                    {actualCharacter?.name}
                                </td>
                                <td>{actualCharacter?.data.Class}</td>
                                <td style="text-align: center;">{actualCharacter?.data.Level}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            <div style="height: 1rem;"/>
            <div class="custom-subtitle">Level</div>
            <input
                type="number"
                id="level"
                min="1"
                max="20"
                bind:value={campaign_level}
            />
            <div style="height: 1rem;"/>
            <button
                class="custom-box custom-button {!userAuthorized
                    ? 'disabled'
                    : ''}"
                style="border: solid 1px var(--border);"
                on:click={async () => {
                    if (userAuthorized) {
                        let campaign = await upsertNewCampaign(campaign_name, campaign_level, characters);
                        let campaign_id = campaign?.data?.id;
                        goto(
                            `/campaign/${campaign_id}`,
                        );
                    }
                }}
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
    .custom-box {
        border: 2px solid var(--border);
        padding: 0rem;
        padding-bottom: 0.5rem;
        background-color: var(--background);
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 6px;
        box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
        overflow: clip;
        cursor: default;
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
        padding-left: 0.5rem;
        padding-right: 0.5rem;
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
    .disabled {
        cursor: not-allowed;
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
        position: absolute;
        margin-top: 5px;
        z-index: 1;
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