<script lang="ts">
    interface Props {
        shown?: boolean;
    }

    let { shown = $bindable(false) }: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions-->
<div class="custom-box bubble" onclick={() => {
    shown = !shown
    }}>
    <div style="margin-top: -0.6rem; user-select: none">
        {shown ? "-" : "+"}
    </div>
</div>

<style>
    .bubble {
        border: 2px solid var(--border);
        border-radius: 999px;
        border-top-right-radius: 0px;
        border-top-left-radius: 0px;
        border-top-color: var(--background);
        padding: 0px;
        background-color: var(--background);
        width: 1.2rem;
        height: 1rem;
    }
</style>