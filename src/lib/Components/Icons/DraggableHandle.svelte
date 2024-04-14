<script lang="ts">
    export let dragDisabled = true;
    const startDrag = (e: { preventDefault: () => void; }) => {
		// preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
		e.preventDefault();
		dragDisabled = false;
	}
</script>
<div class="handle" style:cursor={dragDisabled ? 'grab' : 'grabbing'} on:mousedown={startDrag}>

</div>

<style>
    .handle {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 5px;
        background-color: var(--secondary);
    }
</style>