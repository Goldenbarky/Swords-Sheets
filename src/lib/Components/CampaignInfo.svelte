<script lang="ts">
    export let invites:CampaignDataRow[];
    export let campaign:CampaignDataRow|undefined;
    export let shown:boolean;
    export let acceptInvite;
    //To-do fix supabase issues so we can delete campaign invite from here
</script>
<div class="modal {shown ? 'is-active' : ''}">
    <!-- svelte-ignore a11y-missing-attribute a11y-no-static-element-interactions a11y-click-events-have-key-events-->
    <div
        class="modal-background"
        on:click={() => {
            shown = false;
        }}
    />
    <div class="modal-content" style="display: grid; align-items: center; justify-items: center;">
        {#if campaign === undefined}
            {#each invites as invite}
                <div class="custom-box column" style="width: fit-content; height: fit-content;">
                    <div class="custom-title">Campaign Invites</div>
                    <div class="custom-box" style="padding-bottom: 0rem;">
                        <div class="row">
                            <div class="custom-subtitle" style="margin-right: 0.5rem;">{invite.name}</div>
                            <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions-->
                            <div class="custom-box custom-button" style="margin-right: 0.5rem; color: green" on:click={async () => {
                                campaign = invites.find(x => x.id === invite.id);
                                await acceptInvite(invite.id);
                            }}>&#x2714;</div>
                            <div class="custom-box custom-button" style="color: red">&#x2716;</div>
                        </div>
                    </div>
                </div>  
            {/each}
        {:else}
            <div class="custom-box column" style="width: fit-content; height: fit-content;">
                <div class="custom-title">Campaign Info</div>
                <div class="row">
                    <div class="custom-subtitle">{campaign.name}</div>
                </div>
            </div>
        {/if}
        
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