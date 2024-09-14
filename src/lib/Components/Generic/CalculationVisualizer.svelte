<script lang="ts">
    import { bonusToString } from "$lib/GenericFunctions";
    import Divider from "../Helpers/Divider.svelte";
    import NumberLabel from "./NumberLabel.svelte";
    import { Calculation } from "../Classes/DataClasses";

    export let maths:Calculation = new Calculation();
    let variables = maths.getVariables();
</script>
<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="spell-detail custom-button">?
    <div class="box tooltip-box">
        <div class="tooltip-text">
            <div class="custom-title">Calculation</div>
            {#each variables as math, i}
                {#if math.bonus !== 0}
                    {#if i !== 0}
                        <Divider orientation="horizontal"/>
                    {/if}
                    <NumberLabel
                        number={bonusToString(math.bonus)}
                        label={math.name}
                        bold_label={false}
                        label_font_size="small"
                        number_font_size="small"
                        --width=5rem
                        vertical_margins={false}
                    />
                {/if}
                {#if i == variables.length - 1 && variables.length <= 1}
                        <div style="height:0.5rem"/>
                {/if}
            {/each}
            {#if variables.length > 1}
                <Divider orientation="horizontal"/>
                <NumberLabel
                    number={bonusToString(maths.total)}
                    label="Total"
                    bold_label={true}
                    label_font_size="medium"
                    number_font_size="small"
                    --width=5rem
                    vertical_margins={false}
                />
            {/if}
        </div>
    </div>
</div>
<style lang="scss">
    .custom-title {
        @extend .title !optional;
        font-size: medium;
        justify-content: center;
        text-align: center;
        font-weight: bold;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid var(--border);
        color: var(--secondary);
        user-select: none;
        cursor: default;
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
        user-select: none;
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
        margin-top: 5px;
        z-index: 1;
    }
    .tooltip-text {
        visibility: hidden;
        text-align: right;
        color: var(--secondary)
    }
    .spell-detail:hover .tooltip-box {
        visibility: visible;
    }
    .spell-detail:hover .tooltip-text {
        visibility: visible;
    }
</style>