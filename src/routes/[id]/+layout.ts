
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params: { id }, parent }) => {
    const { database } = await parent();

    if (await database.setGetCharacter(id) === null) {
        redirect(303, "/");
    }

    return { id };
}