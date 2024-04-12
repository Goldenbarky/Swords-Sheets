import { mode } from "$lib/Theme";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, parent, depends }) => {
    const data = await parent();
    if (data.sheets.owner_id !== data.session?.user.id) redirect(303, `/${data.id}`);
    mode.set("use");
}