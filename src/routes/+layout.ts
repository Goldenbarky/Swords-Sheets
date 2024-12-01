import type { LayoutLoad } from "./$types";

import { browser } from '$app/environment';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createBrowserClient, isBrowser, parse } from '@supabase/ssr'
import { DatabaseConnection } from "$lib/Database.svelte";

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

    const indexPage = await fetch('https://5e.tools/data/spells/index.json');

    const files = await indexPage.json();
    const spellFiles = await Promise.all(
        Object.values(files).map(n => fetch(`https://5e.tools/data/spells/${n}`))
    );
    // TEMPORARY ADD ALL KIBBLE ELEMENTAL SPELLS
    const kibblePage = await fetch("https://raw.githubusercontent.com/TheGiddyLimit/homebrew/master/spell/KibblesTasty%3B%20Kibbles'%20Generic%20Elemental%20Spells.json");
    spellFiles.push(kibblePage);

    const spellJsons = await Promise.all(spellFiles.map(x => x.json()));

    const spellsCombined = spellJsons.flatMap(x => x['spell']);

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

    return {
        supabase,
        session: session,
        user: data.user,
        spells: spellsCombined,
        database: new DatabaseConnection(supabase),
    };
}