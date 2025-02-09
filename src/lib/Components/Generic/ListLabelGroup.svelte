<script lang="ts">
    import { CharacterController } from "$lib/Database.svelte";
    import ListLabel from "./ListLabel.svelte";

    interface Props {
        lists: {
            label:string,
            list:string[]
        }[];
    }

    let { lists }: Props = $props();
    const characterController = CharacterController.getContext();
</script>

{#each lists as {label, list}, i}
    {#if characterController.mode === "edit" || list.length >= 1}
        <ListLabel label={label} bind:list={lists[i].list}/>
        {#if i != lists.length - 1}
            <div style="margin: 0rem; border-top: 1px solid var(--border); height: 1px"></div>
        {/if}
    {/if}
{/each}
