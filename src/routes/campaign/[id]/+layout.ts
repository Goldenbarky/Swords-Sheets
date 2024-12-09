import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, data, depends, params: { id }, parent }) => {
    const { siteState } = await parent();

    if (await siteState.pullCampaign(id) === null) {
        redirect(303, "/");
    }

    return { id };
}