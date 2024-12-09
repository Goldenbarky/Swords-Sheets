<script lang="ts">
    import { DatabaseClient } from "$lib/Database.svelte";

    const dbClient = DatabaseClient.getContext();
</script>
<div class="column custom-column" style="flex: none;">
    {#if !dbClient.user}
        <div style="height:5rem;">
            <button class="custom-box custom-button" 
                onclick={() => {
                    dbClient.signInWithGoogle();
                }}>
                Log in
            </button>
        </div>
    {:else}
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src={dbClient.user.user_metadata.avatar_url} referrerpolicy="no-referrer" class="profile-pic"/>
    {/if}
</div>
<style>
    .custom-column {
        padding-top: 0;
        padding-bottom: 0;
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
    .profile-pic {
        width: 5rem;
        height: 5rem;
        background-color: gray;
        border-radius: 999px;
        border: 2px solid var(--text);
        user-select: none;
    }
</style>