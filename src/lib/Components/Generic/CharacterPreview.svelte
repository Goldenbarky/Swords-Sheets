<script lang="ts">
    import { goto } from "$app/navigation";

    export let name:string;
    export let character_class:string;
    export let level:string;
    export let primary_color:string;
</script>
<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="custom-box" on:click={() => {goto(`/${name}`)}}>
    <div class="color-tab" style="background-color: {primary_color}"/>
    <div class="border">
        <div class="custom-title">{name}</div>
        <div class="custom-subtitle">Level {level} {character_class}</div>
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