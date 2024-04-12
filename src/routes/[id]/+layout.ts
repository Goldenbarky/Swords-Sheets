
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import { theme } from "$lib/Theme";

export const load: LayoutLoad = async ({ fetch, data, depends, params: { id }, parent }) => {
    const { supabase, session } = await parent();

    if(!session) redirect(303, "/");
    
    const { data:sheets, error } = await supabase.from("characters").select("*").eq("name", id).single();

    if(sheets && sheets["theme"] && theme) theme.set(sheets["theme"]);

    if(error) redirect(303, "/");

    return { id, sheets };
}