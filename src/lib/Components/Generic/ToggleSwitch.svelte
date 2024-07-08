<script lang="ts">
    export let title:string;
    export let toggle:boolean = false;
</script>

<div style="display: flex; flex-direction: row">
    <div class="custom-title" style="padding-right: 0.5rem;">{title}</div>
    <label class="switch">
        <input type="checkbox" bind:checked={toggle}/>
        <span class="slider round"></span>
    </label>
</div>


<style lang="scss">
    .custom-title {
        color: var(--text);
    }
    /* The switch - the box around the slider */
    .switch {
        position: relative;
        display: inline-block;
        width: 45px;
        height: 22px;
    }

    /* Hide default HTML checkbox */
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    /* The slider */
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--background);
        border: 1px solid var(--border);
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 15px;
        width: 15px;
        left: 1px;
        bottom: 3px;
        background-color: var(--text);
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }

    input:checked + .slider {
        background-color: var(--secondary);
    }

    input:focus + .slider {
        box-shadow: 0 0 1px var(--secondary);
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
    }

    /* Rounded sliders */
    .slider.round {
        border-radius: 15px;
        color: var(--text);
    }

    .slider.round:before {
        border-radius: 50%;
    }
</style>
