<script lang="ts">
    import "../../app.scss";
    import { theme } from "$lib/Theme";
    import MainPage from '$lib/Pages/CharacterSheet/MainPage.svelte';
    import { getCampaign, getInvitesForCharacter, supabaseObject } from "$lib/GenericFunctions";
    import { onMount } from "svelte";
    import { DatabaseConnection } from "$lib/Database.svelte";
    
    let { data, children } = $props();

    let campaign_invites: CampaignDataRow[] = $state([]);
    let campaign: CampaignDataRow | undefined = $state();

    $effect(() => {
        if (!dbContext.activeCharacterRow) {
            return;
        }

        if(!dbContext.activeCharacterRow.data.Campaign) {
            getInvitesForCharacter(dbContext.activeCharacterRow.id).then((s) => campaign_invites = (s!));
        } else {
            getCampaign(dbContext.activeCharacterRow.data.Campaign).then(s => campaign = s);
        }
    });
    
    const dbContext = DatabaseConnection.getDatabaseContext();
</script>
<div class="outer"
    style:--primary={$theme.primary}
    style:--secondary={$theme.secondary}
    style:--background={$theme.background}
    style:--background_hover={$theme.background_hover}
    style:--text={$theme.text}
    style:--border={$theme.border}>
    {@render children()}
    {#if dbContext.activeCharacterRow}
        <MainPage
            bind:sheet={dbContext.activeCharacterRow}
            spells={data.spells}
        />
    {/if}
</div>
<style lang="scss">
    :global(.center) {
        align-content: center;
    }
    :global(body) {
        width: 100vw;
        height: 100vh;
        background-color: var(--background);
        //overflow: clip;
    }
    :global(.custom-box) {
        border: 2px solid var(--border);
        padding: 0.75rem;
        padding-top: 0rem;
        background-color: var(--background);
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 6px;
        box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
    }
    .outer {
        width: 100vw;
        height: 100vh;
        background-color: var(--background);
    }
</style>