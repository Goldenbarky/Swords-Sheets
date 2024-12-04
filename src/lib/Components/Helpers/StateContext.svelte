<script lang="ts">
    import { DatabaseClient, SiteState } from "$lib/Database.svelte";
    import type { Snippet } from "svelte";

    let { dbClient, siteState, children }: { dbClient: DatabaseClient; siteState: SiteState; children: Snippet; } = $props();

    let reactiveDbClient = $state(dbClient);
    DatabaseClient.setDatabaseClient(reactiveDbClient);
    let reactiveSiteState = $state(siteState);
    SiteState.setSiteState(reactiveSiteState);
</script>

{@render children()}
