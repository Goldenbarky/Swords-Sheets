
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params: { id }, parent }) => {
    const { siteState } = await parent();

    if (await siteState.pullCharacter(id) === null) {
        redirect(303, "/");
    }

    return { id };
}