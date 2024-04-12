<script lang="ts">
    import Armor from "$lib/Components/Armor.svelte";
    import NumberLabel from "$lib/Components/Generic/NumberLabel.svelte";
    import MagicItem from "$lib/Components/MagicItem.svelte";
    import Weapon from "$lib/Components/Weapon.svelte";
    import Shield from "$lib/Components/Shield.svelte";
    import { updateDatabase } from "$lib/GenericFunctions";
    import { mode } from "$lib/Theme";

    export let character: CharacterSheet;

    const removeWeapon = (weapon:any) => {
        character.Equipment.Weapons = character.Equipment.Weapons.filter(x => x !== weapon);
    }
</script>
<div
    class="columns has-text-centered"
    style="background-color: var(--background);"
>
    <div class="edge"></div>
    <div class="column custom-column center">
        <div style="width: 100%; display: flex; flex-direction: column; align-items:center;">
            <div class="custom-title" style="width:100%;">Weapons</div>
            {#each character.Equipment.Weapons as weapon}
                <Weapon
                    bind:weapon={weapon}
                    removeFunction={() => {removeWeapon(weapon)}}
                />
                <div style="height: 0.5rem;"/>
            {/each}
            {#if $mode === "edit"}
                <button class="custom-box custom-button" on:click={() => character.Equipment.Weapons = [...character.Equipment.Weapons, {
                    "Name":"",
                    "Ability":"Strength",
                    "Bonus":0,
                    "Proficient":false,
                    "Base_Damage":{
                        "Dice":"",
                        "Type":""
                    },
                    "Extra_Damage":[],
                    "Entries":[]
                }]}>+</button>
            {/if}
        </div>
    </div>
    <div class="column custom-column center">
        <div>
            <div class="custom-title" style="width: 100%;">Armor</div>
            <Armor
                bind:armor={character.Equipment.Armor}
            />
        </div>
        <br>
        {#each character.Equipment.Shields as shield}
            <div class="row" style="position: relative;">
                {#if $mode === "edit"}
                    <button class="custom-box custom-button custom-tiny-button" style="position: absolute; left: -2.5rem;" on:click={() => {
                        character.Equipment.Shields = character.Equipment.Shields.filter(x => x !== shield);
                        updateDatabase();
                    }}>-</button>
                {/if}
                <div>
                    <Shield
                        bind:shield={shield}
                    />
                </div>
            </div>
            <div style="height:1rem;"/>
        {/each}
        {#if $mode === "edit"}
            <button class="custom-box custom-button" on:click={() => {
                character.Equipment.Shields = [...character.Equipment.Shields, {Name: "", Base: 2, Bonus: 0, Entries: {Title: "", Description: []}}];
                updateDatabase();
            }}>Add New Armor Enhancement</button>
        {/if}
        <div class="custom-title" style="width: 100%;">Magic Items</div>
        {#each character.Equipment.Magic_Items as magic_item}
            <MagicItem
                bind:item={magic_item}
                removeFunction={() => {character.Equipment.Magic_Items=character.Equipment.Magic_Items.filter(x => x !== magic_item); updateDatabase();}}
            />
        {/each}
        {#if $mode === "edit"}
            <div style="display: flex; justify-content: center;">
                <button class="custom-box custom-button" on:click={() => character.Equipment.Magic_Items = [...character.Equipment.Magic_Items, {Name: "", Attuned:false, Entries:{Title:"", Description:[]}}]}>+</button>
            </div>
        {/if}
    </div>
    <div class="column custom-column center">
        <div class="custom-box">
            <div class="custom-title">Gold & Valuables</div>
            <div>
                {#each character.Equipment.Valuables as valuable}
                    <div class="row">
                        {#if $mode === "edit"}
                            <button class="custom-box custom-button custom-tiny-button" on:click={() => {
                                character.Equipment.Valuables = character.Equipment.Valuables.filter(x => x !== valuable);
                                updateDatabase();
                            }}>-</button>
                        {/if}
                        <div>
                            <NumberLabel
                                bind:label={valuable.Name}
                                label_placeholder={"New Item"}
                                bind:number={valuable.Amount}
                                bold_label={false}
                                number_edit_modes={["use"]}
                                label_edit_modes={["edit"]}
                                incremental={true}
                            />
                        </div>
                    </div>
                {/each}
                {#if $mode === "edit"}
                    <div style="display: flex; justify-content: center;">
                        <button class="custom-box custom-button" on:click={() => character.Equipment.Valuables = [...character.Equipment.Valuables, {Name: "", Amount: 0}]}>+</button>
                    </div>
                {/if}    
            </div>
        </div>
    </div>
    <div class="column custom-column center">
        <div class="custom-box" style="width: 100%;">
            <div class="custom-title" style="width: 100%;">Inventory</div>
            <div>
                {#each character.Equipment.Inventory as item}
                    <div class="row">
                        {#if $mode === "edit"}
                            <button class="custom-box custom-button custom-tiny-button" on:click={() => {
                                character.Equipment.Inventory = character.Equipment.Inventory.filter(x => x !== item);
                                updateDatabase();
                            }}>-</button>
                        {/if}
                        <div>
                            <NumberLabel
                                bind:label={item.Name}
                                bind:number={item.Amount}
                                bold_label={false}
                                number_edit_modes={["use"]}
                                label_edit_modes={["edit"]}
                                incremental={true}
                            />
                        </div>
                    </div>
                {/each}
                {#if $mode === "edit"}
                    <div style="display: flex; justify-content: center;">
                        <button class="custom-box custom-button" on:click={() => character.Equipment.Inventory = [...character.Equipment.Inventory, {Name: "", Amount: 0}]}>+</button>
                    </div>
                {/if}
            </div>
        </div>
    </div>
    <div class="edge"></div>
</div>
<style lang="scss">
    .custom-column {
        @extend .column !optional;
        margin: 0.75rem;
        margin-top: 1.5rem;
        padding: 0px;
        flex-direction: column;
        display: flex;
        align-items: center;
        background-color: var(--background);
    }
    .custom-title {
        @extend .title !optional;
        font-size: x-large;
        justify-content: center;
        text-align: center;
        font-weight: bold;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid var(--border);
        color: var(--secondary);
    }
    .edge {
        width: 10%;
        flex-shrink: 1;
        margin-top: 0.75rem;
        background-color: var(--background);
    }
    .row {
        display: flex;
        flex-direction: row;
        align-items: center;
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