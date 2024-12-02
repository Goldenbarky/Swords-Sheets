<script lang="ts">
    import CharacterSummary from "$lib/Components/DMScreen/CharacterSummary.svelte";

    interface Props {
        characters: CharacterDataRow[];
    }

    let { characters }: Props = $props();
</script>

<div class="grid">
    {#each characters as character, i (character)}
        <CharacterSummary
            bind:character={characters[i]}
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