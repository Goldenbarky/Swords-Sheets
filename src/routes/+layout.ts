import type { LayoutLoad } from "./$types";

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createBrowserClient, isBrowser, parse } from '@supabase/ssr'
import { DatabaseClient, SiteState } from "$lib/Database.svelte";

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

    const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        // ONLY CAUSES ISSUES, IDK
        // global: {
        //     fetch,
        // },
        cookies: {
            get(key) {
                if (!isBrowser()) {
                    return JSON.stringify(data.session);
                }

                const cookie = parse(document.cookie);
                return cookie[key];
            },
        },
    });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    let dbClient = new DatabaseClient(supabase, session, data.user);
    let siteState = new SiteState(dbClient);
    return {
        supabase,
        session: session,
        user: data.user,
        dbClient,
        siteState,
        spells: data.spells
    };
}