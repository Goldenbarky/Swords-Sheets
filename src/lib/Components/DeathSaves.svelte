<script lang="ts">
    import { CharacterSheetController } from "$lib/Database.svelte";
    import CheckedBox from "./Generic/CheckedBox.svelte";

    const characterController = CharacterSheetController.getCharacterController();
</script>

<fieldset class="row">
    <div class="row boxes {characterController.mode === "view" ? "disable" : ""}">
        {#each Array(3) as _}
            <CheckedBox
                color="red"
            />
        {/each}
    </div>
    <div class="row">
        <div style="width: 0.5rem; border-right: 1px solid var(--border)"></div>
        <div style="width: 0.5rem;"></div>
    </div>
    <div class="row boxes {characterController.mode === "view" ? "disable" : ""}">
        {#each Array(3) as _}
            <CheckedBox
                color="green"
            />
        {/each}
    </div>
</fieldset>

<style>
    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }
    .boxes {
        width: 6rem;
    }
    .disable {
        pointer-events: none;
    }
</style>