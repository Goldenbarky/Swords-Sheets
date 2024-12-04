<script lang="ts">
    import {  SiteState } from "$lib/Database.svelte";

    interface Props {
        checked?: boolean;
        checkmark?: string | undefined;
        color?: string | undefined;
        checked_counter?: number;
        onChange?: Function;
    }

    let {
        checked = $bindable(false),
        checkmark = undefined,
        color = undefined,
        checked_counter = $bindable(-1),
        onChange,
    }: Props = $props();

    const siteState = SiteState.getSiteState();
</script>

<div class="checkbox-container" style="{checked ? `outline-color: ${color}` : ""}">
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div class="checkmark" onclick={async () => {
        checked = !checked
        onChange?.();
        if(checked_counter !== -1) {
            if(checked) checked_counter++;
            else checked_counter--;
            // we should move this dependency for saving upwards as this is a generic component
            await siteState.save();
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