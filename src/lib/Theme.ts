import { writable } from "svelte/store";
import ThemeTemplate from "$lib/Data/ThemeTemplate.json";

export let theme = writable(ThemeTemplate);

export let mode = writable("view");