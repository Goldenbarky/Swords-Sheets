<script lang="ts">
    import MainPage from "$lib/Pages/MainPage.svelte";
</script>

<MainPage />

<style>
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
        margin: 0;
        padding: 0;
    }
</style>
