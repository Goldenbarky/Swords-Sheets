<script lang="ts">
    import { signInWithGoogle } from "$lib/GenericFunctions";

    export let user;
</script>
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
<style lang="scss">
    .custom-column {
        padding-top: 0;
        padding-bottom: 0;
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
        border-radius: 999px;
        border: 2px solid var(--text);
        user-select: none;
    }
</style>