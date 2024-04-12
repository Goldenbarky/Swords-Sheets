import { writable } from "svelte/store";

export let theme = writable({
    primary: "#8F0002",
    secondary: "#C62F31",
    background: "#1B1919",
    background_hover: "#2F2F2F",
    text: "#ADADAD",
    border: "#ADADAD"
});

export let mode = writable("view");