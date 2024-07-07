<script lang="ts">
    import { updateDatabase } from "$lib/GenericFunctions";
    import { mode } from "$lib/Theme";
    import { SOURCES, dndzone } from "svelte-dnd-action";
    import DraggableHandle from "$lib/Components/Icons/DraggableHandle.svelte";

    export let title:string;
    export let description:{
        "Subtitle":string,
        "Paragraph":string
    }[];
    export let removeFunction:any = () => { };
    export let orderable:boolean;

    $: newList = description.map(x => ({...x, id: crypto.randomUUID()}));

    let dragDisabled = true;

    const handleConsider = (e: { detail: { items: any; info: { source: any; trigger: any; }; }; }) => {
		const {items: newItems, info: {source, trigger}} = e.detail;
		newList = newItems;
	}

	const handleFinalize = async (e: { detail: { items: any; info: { source: any; }; }; }) => {
		const {items: newItems, info: {source}} = e.detail;
        
		description = newItems.map((x: { [x: string]: any; }) => ({ 'Subtitle': x['Subtitle'], 'Paragraph': x['Paragraph'] }));
        newList = newItems;
		// Ensure dragging is stopped on drag finish via pointer (mouse, touch)
		if (source === SOURCES.POINTER) {
			dragDisabled = true;
		}

        await updateDatabase();
	}

</script>
{#if $mode === "edit"}
    <div class="row" style="align-items: flex-start;">
        <button 
            class="custom-box custom-button custom-tiny-button" 
            style="margin-top:0.5rem;" 
            on:click={async () => {
                removeFunction();
                await updateDatabase();
            }}
        >
            -
        </button>
        <div style="width:100%;">
            <div style="width:100%;">
                <div class="custom-title placeholder" on:focusout={updateDatabase} bind:innerText={title} contenteditable="true" placeholder="Title"/>
            </div>
            {#if orderable}
            <div use:dndzone={{ items: newList, dragDisabled }} on:consider={handleConsider} on:finalize={handleFinalize}>
                {#each newList as paragraph (paragraph.id)}
                    <div class="row">
                        <button 
                            class="custom-box custom-button custom-tiny-button" 
                            on:click={async () => {
                                description = description.filter(x => x !== paragraph);
                                await updateDatabase();
                            }}
                        >
                            -
                        </button>
                        <div style="margin-top: 0.2rem;">
                            <p class="placeholder" style="color:var(--secondary);" on:focusout={updateDatabase} bind:innerText={paragraph.Subtitle} contenteditable="true" placeholder="Subtitle"/>
                            <p class="placeholder" on:focusout={updateDatabase} bind:innerText={paragraph.Paragraph} contenteditable="true" placeholder="Description"/>
                        </div>
                        <div style="display: flex; place-content: end; flex-grow: 1">
                            <DraggableHandle bind:dragDisabled/>
                        </div>
                    </div>
                {/each}
            </div>
            {:else}
                {#each description as paragraph}
                    <div class="row">
                        <button class="custom-box custom-button custom-tiny-button" on:click={() => {
                            description = description.filter(x => x !== paragraph);
                            updateDatabase();
                        }}>-</button>
                        <div style="margin-top: 0.2rem;">
                            <p class="placeholder" style="color:var(--secondary);" on:focusout={updateDatabase} bind:innerText={paragraph.Subtitle} contenteditable="true" placeholder="Subtitle"/>
                            <p class="placeholder" on:focusout={updateDatabase} bind:innerText={paragraph.Paragraph} contenteditable="true" placeholder="Description"/>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
    <div style="display: flex; justify-content: center;">
        <button class="custom-box custom-button" on:click={() => description = [...description, {Subtitle:"",Paragraph:""}]}>+</button>
    </div>
{:else}
    <div style="width:100%;">
        <div class="custom-title">{title}</div>
    </div>
    {#each description as paragraph, i}
        {#if paragraph.Subtitle !== ""}
            <p style="color:var(--secondary)">{paragraph.Subtitle}</p>
        {/if}
        <p>{paragraph.Paragraph}</p>
        {#if i != description.length - 1}<div style="height:0.5rem;"/>{/if}
    {/each}
{/if}

<style lang="scss">
    .custom-title {
        @extend .title !optional;
        font-size: large;
        text-align: left;
        width: fit-content;
        border-bottom: 1px solid var(--border);
        color: var(--secondary);
    }
    p {
        text-align: left;
        color: var(--text);
        width: 100%;
        text-wrap: wrap;
    }
    .row {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
    }
    .placeholder {
        width: fit-content;
        pointer-events: auto;
    }
    .placeholder:empty:not(:focus):before, .placeholder:has(br):not(:focus)::before {
        content: attr(placeholder);
        pointer-events: none;
        //font-style: italic;
        filter: brightness(180%);
    }
    .custom-button {
        padding-bottom: 2px;
        background-color: var(--background);
        color: var(--text);
        margin-bottom: 0.2rem;
        margin-top: 0.2rem;
        border-width: 1px;
        user-select: none;
        color: var(--secondary);
        font-size: small;
        cursor: pointer;
    }
    .custom-button:hover {
        background-color: var(--background_hover);
    }
    .custom-tiny-button {
        display: flex;
        width: 0.1rem;
        height: 1rem;
        padding: 0rem 0.4rem 0rem 0.4rem;
        justify-content: flex-end;
        margin-top: 0.3rem;
        margin-right: 0.3rem;
    }
    .custom-tiny-button:hover ~ div {
        background-color: #FFFFFF10;
    }
    
</style>