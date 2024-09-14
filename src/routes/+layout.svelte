<script lang="ts">
    import { invalidate } from "$app/navigation";
    import { user } from "$lib/GenericFunctions.js";
    import { onMount, setContext } from "svelte";
    export let data;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange(async (event, _session) => {
            if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION' || _session?.expires_at !== session?.expires_at) {
                if (_session) {
                    $user = _session.user;
                } else {
                    $user = null;
                }
                // await invalidate("supabase:auth");
            }
        });

        return () => data.subscription.unsubscribe();
    });

    setContext('user', { user: data.user });
</script>

<slot />
