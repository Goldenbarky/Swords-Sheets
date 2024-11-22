<script lang="ts">
    import CharacterSummary from "$lib/Components/DMScreen/CharacterSummary.svelte";

    export let characters:CharacterDataRow[];
</script>

<div class="grid">
    {#each characters as character}
        <CharacterSummary
            bind:character={character}
        />
    {/each}
</div>

<style lang="scss">
    .grid {
        display: grid;
        width: 100%;
        gap: 0.5rem;
        padding: 1rem;
        grid-template-rows: auto auto;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
        grid-auto-flow: column;
    }
</style>