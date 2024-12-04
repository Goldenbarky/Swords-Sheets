<script lang="ts">
    import AbilityBox from '$lib/Components/AbilityBox.svelte';
    import ListLabel from '$lib/Components/Generic/ListLabel.svelte';
    import NumberLabel from '$lib/Components/Generic/NumberLabel.svelte';
    import Skill from '$lib/Components/Skill.svelte';
    import CheckedBox from '$lib/Components/Generic/CheckedBox.svelte';
    import Divider from "$lib/Components/Helpers/Divider.svelte";
    import ColorPicker from "svelte-awesome-color-picker";
    import { Calculation } from '$lib/Components/Classes/DataClasses';
    import { SiteState } from '$lib/Database.svelte';

    const siteState = SiteState.getSiteState();

    let skill1 = new Calculation();
    let skill2 = new Calculation();
    let skill3 = new Calculation();

    skill1.addVariables({name:"Value", bonus: -2});
    skill2.addVariables({name:"Value", bonus: 2});
    skill3.addVariables({name:"Value", bonus: 4});

</script>
<div class="columns has-text-centered">
    <div class="edge"></div>
    <div class="column" style="align-items: flex-start;">
        <div class="custom-box color-picker">
            {#each Object.keys(siteState.theme) as color}
                <ColorPicker bind:hex={siteState.theme[color]} label={color} --cp-border-color={siteState.theme["text"]}/>
            {/each}
        </div>
        <div class="row" style="justify-content: space-evenly;">
            <button class="custom-box custom-button" onclick={() => siteState.save()}>Save</button>
            <button class="custom-box custom-button" onclick={() => siteState.resetTheme()}>Revert</button>
        </div>
        <div style="height:2rem;"></div>
        <div class="custom-box">
            <p class="paragraph">If you're having trouble picking a color scheme try using <a href="https://www.coolors.co" target="_blank">coolors.co</a></p>
        </div>
    </div>
    <div class="column test-area">
        <AbilityBox
            name="Ability Score Box"
            score={21}
            mod="+5"
        />
        <div class="custom-box" style="width:18rem; padding:0px;">
            <NumberLabel
                number="+3"
                label="Label"
            />
        </div>
        <div style="height:1rem;"></div>
        <div class="custom-box">
            <div class="custom-title">Title</div>
            <ListLabel
                label="List 1"
                list={["Item 1", "Item 2"]}
            />
            <div style="margin: 0rem; border-top: 1px solid var(--border); height: 1px; width: 100%;"></div>
            <ListLabel
                label="List 2"
                list={["Item 1", "Item 2"]}
            />
        </div>
    </div>
    <div class="column test-area">
        <div class="custom-box">
            <div class="custom-title">Skills</div>
            <Skill
                name="Skill Name"
                proficiency=""
                bonusCalculator={() => {return skill1}}
            />
            <Skill
                name="Skill Name"
                proficiency="P"
                bonusCalculator={() => {return skill2}}
            />
            <Skill
                name="Skill Name"
                proficiency="E"
                bonusCalculator={() => {return skill3}}
            />
        </div>

        <div class="custom-title">Buttons</div>
        <button class="custom-box custom-button">Normal Button</button>
        <button class="custom-box custom-button" style="background-color:var(--background_hover);">Hovered Button</button>
    </div>
    <div class="column test-area">
        <div class="custom-box" style="width: 100%;">
            <div class="custom-title">Checkboxes</div>
            <div class="row custom-subtitle" style="width:100%; text-align:center;">
                <div class="custom-subtitle" style="border-width: 0px; margin-bottom: 0px; width: 8rem; text-align: center;">
                    Spell Slots
                </div>
            </div>
            <div class="row disable" style="place-content: space-evenly;">
                {#each Array(3) as _, j}
                    <CheckedBox 
                        checkmark="X"
                        color={siteState.theme.secondary}
                        checked = {j === 0}
                    />
                {/each}
            </div>
            <div class="row custom-subtitle" style="width:100%; text-align:center;">
                <div class="custom-subtitle" style="border-width: 0px; margin-bottom: 0px; width: 8rem; text-align: center;">
                    Death Saves
                </div>
            </div>
            <div class="row" style="place-content: space-evenly;">
                <CheckedBox 
                    checkmark="X"
                    color="red"
                    checked = {true}
                />
                <div class="row" style="width: fit-content;">
                    <Divider
                        orientation="vertical"
                    />
                </div>
                <CheckedBox 
                    color="green"
                    checked = {true}
                />
            </div>
        </div>
    </div>
    <div class="edge"></div>
</div>

<style lang="scss">
    .column {
        @extend .column !optional;
        margin: 0.75rem;
        margin-top: 1.5rem;
        padding: 0px;
        flex-direction: column;
        flex-grow: 0;
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
        user-select: none;
        cursor: default;
        width: 100%;
    }
    .custom-subtitle {
        @extend .title !optional;
        font-size: large;
        text-align: left;
        width: fit-content;
        border-bottom: 1px solid var(--border);
        color: var(--secondary);
        margin-bottom: 0.5rem;
    }
    .test-area {
        pointer-events: none;
    }
    .color-picker {
        align-items: flex-start;
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
    .edge {
        width: 5%;
        flex-shrink: 1;
        margin-top: 0.75rem;
        background-color: var(--background);
    }
    .row {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    .paragraph {
        color: var(--text);
        text-align: center;
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
</style>