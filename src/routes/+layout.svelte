<script lang="ts">
  import { onMount } from 'svelte';

    let { data, children } = $props();

    data.dbClient.setContext();
    data.siteState.setContext();
    
    onMount(() => {
        return data.dbClient.setupHooks();
    });
</script>

<svelte:boundary>
    {@render children()}

    {#snippet failed(error)}
        <div>Yo something seriously got messed up, put an issue in the github please {error}</div>
    {/snippet}
</svelte:boundary>
