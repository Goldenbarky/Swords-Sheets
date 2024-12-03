<script lang="ts">
    import FeaturesBox from "$lib/Components/FeaturesBox.svelte";

    interface Props {
        character: CharacterSheet;
    }

    let { character = $bindable() }: Props = $props();
</script>

<div class="columns has-text-centered" style="background-color: var(--background);">
    <div class="edge"></div>
    <div class="column custom-column center">
        <FeaturesBox
            title="Class Features"
            bind:features={character.Features.Class}
        />
    </div>
    <div class="column custom-column center">
        <FeaturesBox
            title="Feats"
            bind:features={character.Features.Feats}
        />
    </div>
    <div class="edge"></div>
</div>

<style lang="scss">
    .custom-column {
        @extend .column !optional;
        margin: 0.75rem;
        margin-top: 1.5rem;
        padding: 0px;
        flex-direction: column;
        display: flex;
        align-items: center;
        background-color: var(--background);
    }
    .edge {
        width: 5%;
    }
</style>