<script lang="ts">
    import { CharacterController, DatabaseClient, SiteState } from "$lib/Database.svelte";

    interface Props {
        shown: boolean;
    }

    let {
        shown = $bindable(),
    }: Props = $props();

    const dbClient = DatabaseClient.getContext();
    const siteState = SiteState.getContext();
    const characterController = CharacterController.getContext();
</script>
<div class="modal {shown ? 'is-active' : ''}">
    <!-- svelte-ignore a11y_missing_attribute, a11y_no_static_element_interactions, a11y_click_events_have_key_events-->
    <div
        class="modal-background"
        onclick={() => {
            shown = false;
        }}
    ></div>
    <div class="modal-content" style="display: grid; align-items: center; justify-items: center;">
        {#if characterController.character.data.Campaign}
            {#await dbClient.getCampaignById(characterController.character.data.Campaign)}
                <div>loading campaign...</div>
            {:then campaign}
                {#if campaign}
                    <div class="custom-box column" style="width: fit-content; height: fit-content;">
                        <div class="custom-title">Campaign Info</div>
                        <div class="row">
                            <div class="custom-subtitle">{campaign.name}</div>
                        </div>
                    </div>
                {:else}
                    <div>Error finding campaign</div>
                {/if}
            {/await}
        {:else}
            {#await dbClient.getCampaignInvitesForCharacterId(characterController.character.id)}
                <div>loading invites...</div>
            {:then invites}
                {#if invites}
                    {#each invites as invite}
                        <div class="custom-box column" style="width: fit-content; height: fit-content;">
                            <div class="custom-title">Campaign Invites</div>
                            <div class="custom-box" style="padding-bottom: 0rem;">
                                <div class="row">
                                    <div class="custom-subtitle" style="margin-right: 0.5rem;">{invite.name}</div>
                                    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions-->
                                    <div class="custom-box custom-button" style="margin-right: 0.5rem; color: green" onclick={() => {
                                        characterController.character.data.Campaign = invite.id;
                                        siteState.save();
                                    }}>&#x2714;</div>
                                    <div class="custom-box custom-button" style="color: red">&#x2716;</div>
                                </div>
                            </div>
                        </div>  
                    {/each}
                {:else}
                    <div>no invites</div>
                {/if}
            {/await}
        {/if}
    </div>
</div>

<style>
    .modal {
        position: absolute;
        width: 100vw;
        height: 100vh;
    }
    .custom-title {
        
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
    .custom-button {
        display: flex;
        justify-content: center;
        padding-bottom: 2px;
        background-color: var(--background);
        color: var(--text);
        margin-bottom: 0.2rem;
        margin-top: 0.2rem;
        user-select: none;
        font-size: small;
        cursor: pointer;
    }
    .custom-button:hover {
        background-color: var(--background_hover);
    }
    .row {
        display: flex;
        flex-direction: row;
    }
    .column {
        display: flex;
        flex-direction: column;
    }
</style>