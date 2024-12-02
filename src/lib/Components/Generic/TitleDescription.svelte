<script lang="ts">
    import { mode, theme } from "$lib/Theme";
    import { SOURCES, dndzone } from "svelte-dnd-action";
    import DraggableHandle from "$lib/Components/Icons/DraggableHandle.svelte";
    import CheckedBox from "./CheckedBox.svelte";
    import { DatabaseConnection } from "$lib/Database.svelte";

    interface Props {
        feature: TitleDescriptionType;
        removeFunction?: any;
        orderable: boolean;
    }

    let { feature = $bindable(), removeFunction = () => { }, orderable }: Props = $props();

    let newList = $state(feature.Description.map(x => ({...x, id: crypto.randomUUID()})));

    let dragDisabled = $state(true);

    const handleConsider = (e: { detail: { items: any; info: { source: any; trigger: any; }; }; }) => {
		const {items: newItems, info: {source, trigger}} = e.detail;
		newList = newItems;
	}

	const handleFinalize = async (e: { detail: { items: any; info: { source: any; }; }; }) => {
		const {items: newItems, info: {source}} = e.detail;
        
		feature.Description = newItems.map((x: { [x: string]: any; }) => ({ 'Subtitle': x['Subtitle'], 'Paragraph': x['Paragraph'] }));
        newList = newItems;
		// Ensure dragging is stopped on drag finish via pointer (mouse, touch)
		if (source === SOURCES.POINTER) {
			dragDisabled = true;
		}

        await dbContext.save();
	}

    const dbContext = DatabaseConnection.getDatabaseContext();
</script>
{#if $mode === "edit"}
    <div class="row" style="align-items: flex-start;">
        <button 
            class="custom-box custom-button custom-tiny-button"
            style="margin-top:0.5rem;" 
            onclick={async () => {
                removeFunction();
                await dbContext.save();
            }}
        >
            -
        </button>
        <div style="width:100%;">
            <div class="row" style="width:100%;">
                <div class="custom-title placeholder" onfocusout={dbContext.save} bind:innerText={feature.Title} contenteditable="true" placeholder="Title"></div>
                <div class="row" style="padding-left: 0.5rem; width: fit-content;">
                    <i class="custom-subtitle"># of uses: </i>
                    <input onchange={dbContext.save} bind:value={feature.Uses.Max}>
                </div>
            </div>
            {#if orderable}
                <div use:dndzone={{ items: newList, dragDisabled }} onconsider={handleConsider} onfinalize={handleFinalize}>
                    {#each newList as paragraph (paragraph.id)}
                        <div class="row">
                            <div style="margin-top: 0.2rem;">
                                <p class="placeholder" style="color:var(--secondary);" onfocusout={dbContext.save} bind:innerText={paragraph.Subtitle} contenteditable="true" placeholder="Optional Subtitle"></p>
                                <p class="placeholder" onfocusout={dbContext.save} bind:innerText={paragraph.Paragraph} contenteditable="true" placeholder="Description"></p>
                            </div>
                            <div style="display: flex; place-content: end; flex-grow: 1">
                                <DraggableHandle bind:dragDisabled/>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                {#each feature.Description as paragraph}
                    <div class="row">
                        <button class="custom-box custom-button custom-tiny-button" onclick={async () => {
                            feature.Description = feature.Description.filter(x => x !== paragraph);
                            await dbContext.save();
                        }}>-</button>
                        <div style="margin-top: 0.2rem;">
                            <p class="placeholder" style="color:var(--secondary);" onfocusout={dbContext.save} bind:innerText={paragraph.Subtitle} contenteditable="true" placeholder="Optional Subtitle"></p>
                            <p class="placeholder" onfocusout={dbContext.save} bind:innerText={paragraph.Paragraph} contenteditable="true" placeholder="Description"></p>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
    <div style="display: flex; justify-content: center;">
        <button class="custom-box custom-button" onclick={() => feature.Description.push({Subtitle:"",Paragraph:""})}>+</button>
    </div>
{:else}
    <div class="row" style="width:100%;">
        <div class="custom-title">{feature.Title}</div>
        <div class="row {$mode === "view" ? "disabled" : ""}" style="width: fit-content; padding-left: 0.5rem;">
            {#each Array(Number(feature.Uses.Max)) as _, i}
                <CheckedBox 
                    checkmark="X"
                    color={$theme.secondary}
                    checked = {i < feature.Uses.Used}
                    bind:checked_counter = {feature.Uses.Used}
                />
                <div style="width: 0.5rem;"></div>
            {/each}
        </div>
    </div>
    {#each feature.Description as paragraph, i}
        {#if paragraph.Subtitle !== ""}
            <p style="color:var(--secondary)">{paragraph.Subtitle}</p>
        {/if}
        <p>{paragraph.Paragraph}</p>
        {#if i != feature.Description.length - 1}<div style="height:0.5rem;"></div>{/if}
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
    .custom-subtitle {
        padding-right: 0.5rem; 
        color: var(--text);
        font: italic;
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
    .disabled {
        pointer-events: none;
    }
    input {
        all: unset;
        background-color: #00000020;
        border-radius: 1rem;
        width: 4rem;
        color: var(--text);
    }
</style>