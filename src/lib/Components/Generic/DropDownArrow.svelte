<!-- 
    This component must be in an element with the style position: absolute 
    Bind a "shown" variable to be able to control the dropdown that appears when clicked
-->

<script lang="ts">
    interface Props {
        shown?: boolean;
    }

    let { shown = $bindable(false) }: Props = $props();
</script>
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions-->
<div class="custom-box bubble {shown ? "shown" : ""}" onclick={() => {
    shown = !shown
    }}>
    <div style="margin-top: -0.2rem; user-select: none" class="{shown ? "up-arrow" : "down-arrow"}">
        &#60;
    </div>
</div>

<style lang="scss">
    .bubble {
        border: 2px solid var(--border);
        border-radius: 0.5rem;
        border-bottom-right-radius: 0px;
        border-bottom-left-radius: 0px;
        border-bottom: 0px;
        padding: 0px;
        background-color: var(--background);
        width: 2.2rem;
        height: 1.2rem;
        margin-top: -0.16rem;
    }
    .down-arrow {
        transform: rotate(270deg);
        margin-left: -2px;
    }
    .up-arrow {
        transform: rotate(90deg);
        margin-right: -3px;
    }
    .shown {
        border-bottom-color: var(--background);
    }
</style>