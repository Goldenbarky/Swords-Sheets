<script lang="ts">
    import { SiteState } from "$lib/Database.svelte";

    const siteState = SiteState.getContext();
</script>

<div
    class="save-indicator"
    class:save-not={siteState.saveStatus === "NOT"}
    class:save-saving={siteState.saveStatus === "SAVING"}
    class:save-saved={siteState.saveStatus === "SUCCEEDED"}
    class:save-errored={siteState.saveStatus === "FAILED"}
></div>

<style>
    .save-indicator {
        position: absolute;
        width: 2rem;
        height: 2rem;
        border-radius: 25px;
        overflow: clip;
        border: solid black 2px;
        top: 20px;
        left: 50%;
        color: black;
        opacity: 1;
        transition:
            background-color 0.5s ease-in,
            opacity 1s ease-in;
    }
    .save-indicator.save-not {
        opacity: 0;
    }
    .save-indicator.save-saving {
        opacity: 1;
        background-color: yellow;
        transition: none;
    }
    .save-indicator.save-saved {
        opacity: 0;
        background-color: green;
        transition:
            opacity 1s ease-in 1s, background-color 0.5s ease-out;
    }
    .save-indicator.save-errored {
        opacity: 0;
        background-color: red;
        transition:
            opacity 1s ease-in 4s, background-color 0.5s ease-out;
    }
</style>
