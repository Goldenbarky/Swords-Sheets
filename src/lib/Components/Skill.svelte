<script lang="ts">
    import { updateDatabase } from "$lib/GenericFunctions";
    import { mode } from "$lib/Theme";

    export let proficiency:string;
    export let name:string;
    export let bonusCalculator:(arg0: string) => string;
    let bonus:string;

    const proficiencyCycle = (proficiency:string) => {
        switch(proficiency) {
            case "":
                return "P";
            case "P":
                return "E";
            case "E":
                return "";
            default:
                return "";
        }
    }

    $: {
        bonus = bonusCalculator(name);
        proficiency = proficiency;
    }
</script>

<div class="skill-div">
    <div class="proficiency-buffer {$mode !== "edit" ? "disable" : ""}">
        <button class="skill-proficiency" disabled={$mode !== "edit"} on:click={() => {
            proficiency = proficiencyCycle(proficiency); 
            updateDatabase();
        }}>
            {proficiency}
        </button>
    </div>
    <div class="skill-name">{name}</div>
    <div class="skill-bonus">{bonus}</div>
</div>
<style lang="scss">
    .skill-div {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: larger;
    }
    .proficiency-buffer {
        width: 2rem;
        display: flex;
        justify-content: center;
        cursor: pointer;
    }
    .skill-proficiency{
        all: unset;
        outline: 1.5px solid var(--border);
        border-radius: 35%;
        width: 1.2rem;
        height: 1.2rem;
        font-size: small;
        font-weight: 500;
        display: flex;
        justify-items: center;
        justify-content: center;
        align-items: center;
        padding-bottom: 1px;
        color: var(--secondary);
        user-select: none;
    }
    .skill-proficiency:hover {
        background-color: var(--background_hover);
    }
    .skill-name {
        width: 10rem;
        color: var(--text);
        user-select: none;
        cursor: default;
    }
    .skill-bonus {
        width: 2rem;
        text-align: center;
        font-size: small;
        border-bottom: 1px solid var(--border);
        color: var(--text);
        user-select: none;
        cursor: default;
    }
    .disable {
        pointer-events: none;
    }
</style>