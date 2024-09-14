import { supabaseObject } from "$lib/GenericFunctions";
import { theme } from "$lib/Theme";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, data, depends, params: { id }, parent }) => {
    const { supabase, session } = await parent();
    supabaseObject(supabase);
    
    const { data:campaign, error } = await supabase.from("campaigns").select("*").eq("id", id).single();

    if(error) redirect(303, "/");

    return { id, campaign };
}