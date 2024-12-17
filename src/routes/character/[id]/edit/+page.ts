import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
    const { dbClient, siteState, id } = await parent();
    if ((!dbClient.user || !siteState.characterController) || dbClient.user.id !== siteState.characterController.character.owner_id) {
        redirect(303, `/${id}`);
    }

    siteState.characterController.mode = 'edit';
}