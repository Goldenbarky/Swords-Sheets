<script lang="ts">
	interface Props {
		dragDisabled?: boolean;
	}

	let { dragDisabled = $bindable(true) }: Props = $props();
    const startDrag = (e: { preventDefault: () => void; }) => {
		// preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
		e.preventDefault();
		dragDisabled = false;
	}
</script>
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="handle" style:cursor={dragDisabled ? 'grab' : 'grabbing'} onmousedown={startDrag}>
    &#9776;
</div>
<style>
    .handle {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 5px;
        background-color: var(--secondary);
        color: var(--text);
    }
</style>