<script lang="ts">
    import { mode } from "$lib/Theme";
    import ListLabel from "./ListLabel.svelte";

    export let lists:{
        label:string,
        list:string[]
    }[];
</script>

{#each lists as {label, list}, i}
    {#if $mode === "edit" || list.length >= 1}
        <ListLabel label={label} bind:list={list}/>
        {#if i != lists.length - 1}
            <div style="margin: 0rem; border-top: 1px solid var(--border); height: 1px"/>
        {/if}
    {/if}
{/each}