<script lang="ts">
    import { updateDatabase } from "$lib/GenericFunctions";

    export let checked:boolean = false;
    export let checkmark:string | undefined = undefined;
    export let color:string | undefined = undefined;
    export let checked_counter:number = -1;
    export let onChange:Function = () => {};
</script>

<div class="checkbox-container" style="{checked ? `outline-color: ${color}` : ""}">
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div class="checkmark" on:click={() => {
        checked = !checked
        onChange();
        if(checked_counter !== -1) {
            if(checked) checked_counter++;
            else checked_counter--;
            updateDatabase();
        }
    }} style="color: {color}">
        {#if checked}
            {#if checkmark === undefined}
                &check;
            {:else}
                {checkmark}
            {/if}
        {/if}
    </div> 
</div>

<style>
    .checkbox-container {
        outline: 1.5px solid var(--border);
        border-radius: 35%;
        width: 1.2rem;
        height: 1.2rem;
        font-size: small;
        display: block;
        margin: 0px 0.1rem 0px 0.1rem;
        justify-items: center;
        justify-content: center;
        align-items: center;
        position: relative;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .checkmark {
        position: absolute;
        display:flex;
        justify-content: center;
        align-items: center;
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 35%;
        color: var(--secondary);
        top: -1px;
    }
    .checkbox-container:hover {
        background-color: var(--background_hover);
    }
</style>