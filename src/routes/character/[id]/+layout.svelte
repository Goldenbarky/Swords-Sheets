<script lang="ts">
    import "$lib/../app.css";
    import MainPage from '$lib/Pages/CharacterSheet/MainPage.svelte';
    
    let { data, children } = $props();
    
    data.siteState.characterController?.setContext();
</script>
<div class="outer"
    style:--primary={data.siteState.theme.primary}
    style:--secondary={data.siteState.theme.secondary}
    style:--background={data.siteState.theme.background}
    style:--background_hover={data.siteState.theme.background_hover}
    style:--text={data.siteState.theme.text}
    style:--border={data.siteState.theme.border}>
    {@render children()}
    {#if data.siteState.characterController?.character}
        <MainPage
            spells={data.spells}
        />
    {/if}
</div>
<style>
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