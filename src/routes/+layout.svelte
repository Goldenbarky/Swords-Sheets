<script lang="ts">
    import { invalidate } from "$app/navigation";
    import { setContext } from "svelte";
    let { data, children } = $props();
    let { supabase, session } = $derived(data);

    $effect(() => {
        const { data: resp } = supabase.auth.onAuthStateChange(async (event, _session) => {
            if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION' || _session?.expires_at !== session?.expires_at) {
                if (_session) {
                    data.user = _session.user;
                } else {
                    data.user = null;
                }
                // await invalidate("supabase:auth");
            }
        });

        return () => resp.subscription.unsubscribe();
    });

    setContext('user', { user: data.user });
    setContext('database', data.database);
</script>

{@render children()}
