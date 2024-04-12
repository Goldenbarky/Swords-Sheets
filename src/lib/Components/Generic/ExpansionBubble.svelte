<script lang="ts">
    export let shown:boolean = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions-->
<div class="custom-box bubble" on:click = {() => {
    shown = !shown
    }}>
    <div style="margin-top: -0.6rem; user-select: none">
        {shown ? "-" : "+"}
    </div>
</div>

<style lang="scss">
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