<script lang="ts">
    import { goto } from "$app/navigation";

    let { character } = $props();
</script>
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="custom-box" onclick={() => {goto(`/${character.name}`)}}>
    <div class="color-tab" style="background-color: {character.theme.primary}"></div>
    <div class="border">
        <div class="custom-title">{character.name}</div>
        <div class="custom-subtitle">Level {character.data.Level} {character.data.Class}</div>
    </div>
</div>
<style lang="scss">
    .custom-box {
        border: 2px solid var(--border);
        padding: 0rem;
        background-color: var(--background);
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 6px;
        box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
        overflow: clip;
        cursor: pointer;
    }
    .color-tab {
        width: 100%;
        height: 2rem;
        border-bottom: 1px solid var(--border);
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
        width: fit-content;
    }
    .custom-subtitle {
        @extend .title !optional;
        font-size: large;
        text-align: left;
        width: fit-content;
        border-bottom: 1px solid var(--border);
        color: var(--text);
        margin-bottom: 0.5rem;
    }
    .border {
        padding: 0.75rem;
        padding-top: 0;
    }
</style>