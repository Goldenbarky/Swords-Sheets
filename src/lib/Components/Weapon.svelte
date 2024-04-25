<script lang="ts">
    import { bonusToString, getAbilityModifier, getPB, updateDatabase } from "$lib/GenericFunctions";
    import { mode } from "$lib/Theme";
    import AbilitySelector from "./AbilitySelector.svelte";
    import CheckedBox from "./Generic/CheckedBox.svelte";
    import TitleDescription from "./Generic/TitleDescription.svelte";
    import Divider from "./Helpers/Divider.svelte";

    export let weapon:Weapon;
    export let removeFunction:Function = () => {};

    let bonus = weapon.Bonus;

    const calcToHit = () => {
        let proficiency_bonus = getPB();
        let modifier = getAbilityModifier(weapon.Ability) as number;

        let hit_bonus = modifier;

        if(weapon.Proficient) hit_bonus += proficiency_bonus;
        
        return bonusToString(hit_bonus + bonus);
    }

    const calcDamageMod = () => {
        let modifier = getAbilityModifier(weapon.Ability) as number;

        return bonusToString(modifier + bonus);
    }

    let to_hit = calcToHit();
    let damage_mod = calcDamageMod();
    let shown:boolean = false;
</script>
<div class="container" style="width: 100%;">
    <div class="row" style="width:100%;">
        {#if $mode === "edit"}
            <div style="display: flex; flex-direction: column; position: absolute; left: -19px; height: 0;">
                <button class="custom-box custom-button custom-tiny-button" style="margin-top:0.45rem;" on:click={() => {
                    removeFunction();
                    updateDatabase();
                }}>-</button>
            </div>
        {/if}
        <div style="position: relative; width:100%;">
            <div class="custom-box" style="padding-top: 0.5rem; width:100%;">
                <div class="row" style="width: 100%; {$mode === "edit" ? "min-height:6.5rem;" : ""}">
                    <div class="column" style="padding: 0px;">
                        {#if $mode === "edit"}
                            <div class="custom-title placeholder" style="display:inline-block" on:focusout={updateDatabase} bind:innerText={weapon.Name} contenteditable="true" placeholder="Weapon Name"/>
                        {:else}
                            <div class="custom-title">{weapon.Name}</div>
                        {/if}
                        <div class="custom-subtitle">{to_hit} To Hit</div>
                    </div>
                    <Divider/>
                    <div class="column" style="padding:0px;">
                        {#if $mode === "edit"}
                            <div class="row" style="align-items:center;">
                                <CheckedBox
                                    checked={weapon.Proficient}
                                    onChange={() => {
                                        weapon.Proficient = !weapon.Proficient;
                                        to_hit = calcToHit();
                                        damage_mod = calcDamageMod();
                                        updateDatabase();
                                    }}
                                />
                                <div style="width: 0.5rem;"/>
                                <div style="color: var(--text);">Proficient?</div>
                            </div>
                            <Divider
                                orientation="horizontal"
                            />
                        {/if}
                        <div class="row">
                            {#if $mode === "edit"}
                                <div class="damage placeholder" on:focusout={updateDatabase} bind:innerText={weapon.Base_Damage.Dice} contenteditable="true" placeholder="Dice"/>
                                <div style="width: 0.275rem;"/>
                                <div class="damage"> {damage_mod}</div>
                                <div style="width: 0.275rem;"/>
                                <div class="damage placeholder" on:focusout={updateDatabase} bind:innerText={weapon.Base_Damage.Type} contenteditable="true" placeholder="Damage Type"/>
                            {:else}
                                <div class="damage">{`${weapon.Base_Damage.Dice} ${damage_mod} ${weapon.Base_Damage.Type}`}</div>
                            {/if}
                        </div>
                        {#if weapon.Extra_Damage.length > 0}
                        <Divider
                            orientation="horizontal"
                        />
                        {/if}
                        {#each weapon.Extra_Damage as damage}
                            <div class="row">
                                {#if $mode === "edit"}
                                    <button class="custom-box custom-button custom-tiny-button" on:click={() => {
                                        weapon.Extra_Damage = weapon.Extra_Damage.filter(x => x !== damage);
                                        updateDatabase();
                                    }}>-</button>
                                    <div class="damage placeholder" on:focusout={updateDatabase} bind:innerText={damage.Damage} contenteditable="true" placeholder="0dX"/>
                                    <div style="width: 0.275rem;"/>
                                    <div class="damage placeholder" on:focusout={updateDatabase} bind:innerText={damage.Type} contenteditable="true" placeholder="Damage Type"/>
                                {:else}
                                    <div class="damage">{`${damage.Damage} ${damage.Type}`}</div>
                                {/if}
                            </div>
                        {/each}
                        {#if $mode === "edit"}
                            <button class="custom-box custom-button" on:click={() => weapon.Extra_Damage = [...weapon.Extra_Damage, {Damage:"",Type:""}]}>+</button>
                        {/if}
                    </div>
                </div>
            </div>
            {#if $mode === "edit"}
                <AbilitySelector
                    category_name = "Weapon"
                    bind:selected_ability = {weapon.Ability}
                    onChange = {() => { to_hit = calcToHit(); damage_mod = calcDamageMod(); }}
                />
            {/if}
        </div>
        <div style="display: flex; flex-direction: column; position: absolute; right: -19px">
            {#each [0, 1, 2, 3] as item_bonus}
                {#if $mode === "edit" || (item_bonus === bonus && item_bonus !== 0)}
                    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
                    <div class="custom-box custom-side-tab {item_bonus === bonus ? "selected" : ""}" on:click={() => {
                        weapon.Bonus = item_bonus;
                        bonus = item_bonus;
                        to_hit = calcToHit();
                        damage_mod = calcDamageMod();
                        updateDatabase();
                    }}>+{item_bonus}</div>
                {/if}
            {/each}
        </div>
    </div>
    {#if shown}
        <div class="custom-box dropdown">
            <TitleDescription
                title={""}
                description={weapon.Entries}
            />
        </div>
    {/if}
    {#if $mode === "edit" || weapon.Entries.length >= 1}
        <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions-->
        <div class="custom-box bubble" on:click = {() => {
            shown = !shown
            }}>
            <div style="margin-top: -0.6rem; user-select: none">
                {shown ? "-" : "+"}
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-grow: 0;
        flex-direction: column;
        align-items: center;
        height: fit-content;
        width: 100%;
    }
    .bubble {
        border: 2px solid var(--border) !important;
        border-radius: 999px !important;
        border-top-right-radius: 0px !important;
        border-top-left-radius: 0px !important;
        border-top-color: var(--background) !important;
        padding: 0px !important;
        background-color: var(--background);
        width: 1.2rem !important;
        height: 1rem !important;
    }
    .dropdown {
        width: 90% !important;
        border-top-left-radius: 0px !important;
        border-top-right-radius: 0px !important;
        border-top: 0px !important;
    }
    .custom-title {
        @extend .title !optional;
        font-size: large;
        text-align: center;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--secondary);
    }
    .custom-subtitle {
        font-size: medium;
        text-align: center;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--text);
        font-style: italic;
    }
    .custom-side-tab {
        font-size: x-small;
        padding: 0.15rem;
        margin: 0px;
        margin-top: 0.45rem;
        border-radius: 0px 6px 6px 0px;
        border-left: 0px;
        color: var(--text);
        cursor: pointer;
        user-select: none;
    }
    .selected {
        border-color: var(--secondary);
        color: var(--secondary);
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
    :has(> .custom-tiny-button:hover) ~ :has(div) > .custom-box {
        background-color: #FFFFFF10;
    }
    .placeholder {
        width: fit-content;
        pointer-events: auto;
    }
    .placeholder:empty:not(:focus):before, .placeholder:has(br):not(:focus)::before {
        content: attr(placeholder);
        pointer-events: none;
        //font-style: italic;
        filter: brightness(50%);
    }
    .damage {
        color: var(--text);
        width: fit-content;
        font-size: small;
        text-wrap: nowrap;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
    .container {
        width: 3rem;
        display:flex;
        align-items: center;
        justify-content: center;
    }
    .column {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 49%;
        min-width: 8rem;
    }
</style>