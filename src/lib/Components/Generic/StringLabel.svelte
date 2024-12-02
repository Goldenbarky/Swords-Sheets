<script lang="ts">
    import Divider from "../Helpers/Divider.svelte";

    interface Props {
        value: string;
        label: string;
    }

    let { value, label }: Props = $props();
</script>

<div class="row" style="margin:0.2rem; justify-content: space-evenly; width: 100%;">
    <div class="custom-title" style="width: 40%;">{label}</div>
    <div class="row">
        <Divider/>
    </div>
    <div class="value" style="width: 40%;">{value}</div>
</div>
<style>
    .custom-title {
        font-size: small;
        justify-content: center;
        text-align: left;
        color: var(--text);
        width: 40%;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
    .value {
        font-size: small;
        text-align: right;
        color: var(--text);
        width: 40%;
    }
</style>