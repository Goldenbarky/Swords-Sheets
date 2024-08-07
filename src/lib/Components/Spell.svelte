<script lang="ts">
    import SpellDescription from "./SpellDescription.svelte";
    import StringLabel from "./Generic/StringLabel.svelte";
    import { updateDatabase } from "$lib/GenericFunctions";
    import { mode } from "$lib/Theme";

    //@ts-nocheck
    export let spell:{
        name:string,
        school:keyof typeof schools,
        level:number,
        meta:{
            ritual:boolean
        }
        time:{
            number:number,
            unit:string
        }[],
        components:Record<string, boolean>,
        range:{
            type:string,
            distance:{
                type:string,
                amount:number
            }
        },
        duration:{
            duration:{
                type:string,
                amount:number
            },
            type:string,
            concentration:boolean
        }[],
        entries:string[],
        entriesHigherLevel:{
            entries:string[],
            name:string,
            type:string
        }[]
    };

    export let prepared:string = "false";
    export let onChange:Function;
    export let removeFunction:Function;

    const getComponents = () => {
        return Object.keys(spell.components).filter(x => spell.components[x]).join(", ").toUpperCase()
    }

    const getRange = () => {
        if(spell.range.distance.type === "self") return "Self"
        else if(spell.range.distance.type === "touch") return "Touch"
        else if(spell.range.type === "cone" || spell.range.type === "line") return `Self (${spell.range.distance.amount}-${spell.range.distance.type} ${spell.range.type})`
        else if(spell.range.type === "point") return `${spell.range.distance.amount} ${spell.range.distance.type}`
        else return "Error, please report"
    }

    const getDuration = () => {
        if(spell.duration[0].type === "special") return "Special"
        else if(spell.duration[0].type === "instant") return "Instantaneous"
        else if(spell.duration[0].type === "permenant") return "Until Dispelled"
        else if(spell.duration[0].type === "timed") {
            let amount = spell.duration[0].duration.amount
            let duration = spell.duration[0].duration.type
            return `${amount} ${amount > 1 ? duration + "s" : duration}`
        } else return "Error, please report"
    }
    
    const schools = {
        "A":"Abjuration",
        "C":"Conjuration",
        "D":"Divination",
        "E":"Enchantment",
        "V":"Evocation",
        "I":"Illusion",
        "N":"Necromancy",
        "T":"Transmutation"
    }

    const getlevel = () => {
        if(spell.level === 1) return "1st"
        else if(spell.level === 2) return "2nd"
        else if(spell.level === 3) return "3rd"
        else return spell.level + "th"
    }

    const getDetails = () => {
        let details:string[] = [];

        if(spell.meta != undefined && spell.meta.ritual) details.push("R");
        if(spell.duration[0].concentration) details.push("C");

        return details;
    }

    const getUpcast = () => {
        if(spell.entriesHigherLevel != undefined) {
            return spell.entriesHigherLevel[0].entries[0];
        } else return "";
    }

    let shown = false;
</script>

<div class="container">
    <div class="box custom-box" style="flex-grow: 1; padding-right: 0.25rem; min-width: fit-content; max-width: 30rem;">
        <div class="row">
            {#if spell.level === 0}
                <div class="custom-subtitle cantrip">{spell["name"]}</div>
            {:else if prepared === "always"}
                <div class="custom-subtitle cantrip always-prepared">{spell["name"]}</div>
            {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
                <div class="custom-subtitle {$mode !== "use" ? "disable" : ""}" on:click={() => {
                    prepared = prepared === "true" ? "false" : "true";
                    updateDatabase();
                    onChange(prepared);
                }}>
                {#if String(prepared) !== "false"}<span class="highlighted">{spell["name"]}</span>
                {:else}{spell["name"]}
                {/if}
                </div>
            {/if}
            <div class="row">
                {#each getDetails() as detail}
                    <div class="spell-detail">{detail}
                        <div class="box tooltip-box">
                            <div class="tooltip-text">
                                {#if detail === "C"} Concentration
                                {:else if detail === "R"} Ritual
                                {/if}
                            </div>
                        </div>
                    </div>
                {/each}
                {#if $mode === "edit"}
                    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
                    <div class="spell-detail custom-button {prepared === "always" ? "" : "not-selected"}" on:click={() => {
                        if(prepared === "always") {
                            prepared = "false";
                        } else {
                            console.log(prepared);
                            onChange(prepared, true);
                            prepared = "always";
                        }
                        
                        updateDatabase();
                    }}>A
                        <div class="box tooltip-box">
                            <div class="tooltip-text">Always Prepared</div>
                        </div>
                    </div>
                    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
                    <div class="spell-detail custom-button" on:click={removeFunction(spell.name, spell.level)}>X
                        <div class="box tooltip-box">
                            <div class="tooltip-text">Remove Spell</div>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
        <p><i>
            {#if spell.level === 0} {schools[spell.school]} Cantrip
            {:else}
                {getlevel()}-Level {schools[spell.school]}
            {/if}
        </i></p>
    </div>
    {#if shown}
        <div class="box custom-box dropdown" style="max-width: 28.5rem;">
            <div class="container">
                <StringLabel
                label="Casting Time"
                value={`${spell.time[0].number} ${spell.time[0].unit}`}
                />
                <StringLabel
                    label="Range"
                    value={getRange()}
                />
                <StringLabel
                    label="Components"
                    value={getComponents()}
                />
                <StringLabel
                    label="Duration"
                    value={getDuration()}
                />
                <SpellDescription
                    entries={spell.entries}
                    upcast={getUpcast()}
                    level={spell.level}
                />
            </div>
        </div>
    {/if}
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions-->
    <div class="custom-box bubble" on:click = {() => {
        shown = !shown
        console.log(spell);
        }}>
        <div style="margin-top: -0.6rem; user-select: none">
            {shown ? "-" : "+"}
        </div>
    </div>
</div>

<style lang="scss">
    .custom-box {
        display: block;
        padding: 0.75rem;
        padding-bottom: 0.25rem;
        padding-top: 0.25rem;
        background-color: var(--background);
        width: 90%;
        height: fit-content;
        margin-bottom: 0px;
    }
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: fit-content;
        max-width: 19rem;
        min-width: fit-content;
        margin: 0;
    }
    .dropdown {
        width: 85%;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
        border-top: 0px;
    }
    .bubble {
        border: 2px solid var(--border);
        border-radius: 999px;
        border-top-right-radius: 0px;
        border-top-left-radius: 0px;
        border-top-color: var(--background);
        padding: 0px;
        background-color: var(--background);
        width: 1.2rem;
        height: 1rem;
    }
    .spell-detail{
        outline: 1.5px solid var(--border);
        border-radius: 35%;
        width: 1.2rem;
        height: 1.2rem;
        font-size: small;
        font-weight: 500;
        display: inline-block;
        justify-items: center;
        justify-content: center;
        align-items: center;
        padding-bottom: 1px;
        margin-left: 0.5rem;
        color: var(--secondary);
    }
    .custom-subtitle {
        @extend .title !optional;
        font-size: large;
        width: fit-content;
        color: var(--text);
        text-align: left;
        cursor: pointer;
        user-select: none;
    }
    .cantrip {
        cursor: default !important;
        color: var(--secondary) !important;
    }
    .always-prepared {
        border-bottom: 1px solid var(--border);
    }
    .tooltip-box {
        border: 2px solid var(--border);
        padding: 0.75rem;
        padding-bottom: 0.25rem;
        padding-top: 0.25rem;
        background-color: var(--background);
        height: fit-content;
        width: fit-content;
        margin-bottom: 0px;
        visibility: hidden;
        position: absolute;
        right: 7%;
        top: 1.7rem;
        z-index: 1;
    }
    .tooltip-text {
        visibility: hidden;
        text-align: right;
        color: var(--secondary)
    }
    .not-selected {
        color: var(--text) !important;
    }
    .spell-detail:hover .tooltip-box {
        visibility: visible;
    }
    .spell-detail:hover .tooltip-text {
        visibility: visible;
    }
    .row {
        display: flex;
        flex-direction: row;
        place-content: space-between;
    }
    p {
        text-align: left;
        color: var(--text);
    }
    .highlighted {
        color: var(--secondary);
    }
    .disable {
        pointer-events: none;
    }
    .custom-button {
        cursor: pointer;
    }
    .custom-button:hover {
        background-color: var(--background_hover);
    }
</style>