<script lang="ts">
    export let orientation:"vertical" | "horizontal" = "vertical";
</script>

{#if orientation === "vertical"}
    <div class="buffer" style="border-right: 1px solid var(--border);"/>
    <div class="buffer"/>
{:else if orientation === "horizontal"}
    <div class="line"/>
    <div style="width: 100%; height: 0.5rem;"/>
{/if}

<style lang="scss">
    .buffer {
        width: 0.5rem;
    }
    .line {
        height: 0.5rem;
        width: 100%;
        border-bottom: 1px solid var(--border);
    }
</style>