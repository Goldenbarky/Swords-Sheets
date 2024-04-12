import { mode } from "$lib/Theme";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, data, depends }) => {
    mode.set("view");
}