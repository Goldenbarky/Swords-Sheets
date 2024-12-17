import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
    const { siteState } = await parent();
    if (!siteState.characterController) redirect(303, '/');

    siteState.characterController.mode = 'view';
}