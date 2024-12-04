<script lang="ts">
    import StateContext from "$lib/Components/Helpers/StateContext.svelte";
    let { data, children } = $props();
</script>

<StateContext dbClient={data.dbClient} siteState={data.siteState}>
    {@render children()}
</StateContext>
