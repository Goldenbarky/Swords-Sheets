<script lang="ts">
    interface Props {
        orientation?: "vertical" | "horizontal";
    }

    let { orientation = "vertical" }: Props = $props();
</script>

{#if orientation === "vertical"}
    <div class="buffer" style="border-right: 1px solid var(--border);"></div>
    <div class="buffer"></div>
{:else if orientation === "horizontal"}
    <div class="line"></div>
    <div style="width: 100%; height: 0.5rem;"></div>
{/if}

<style>
    .buffer {
        width: 0.5rem;
    }
    .line {
        height: 0.5rem;
        width: 100%;
        border-bottom: 1px solid var(--border);
    }
</style>