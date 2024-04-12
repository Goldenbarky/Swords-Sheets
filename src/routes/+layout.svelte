<script lang="ts">
    import { supabase } from "$lib/GenericFunctions.js";
    import { onMount } from "svelte";
    export let data;
    $supabase = data.supabase;
</script>

<slot />