// import type { LayoutServerLoad } from './$types';

// export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
//   return {
//     session: await getSession(),
//   }
// }

// src/routes/+layout.server.ts
import type { LayoutServerLoad } from "./$types";
export const load: LayoutServerLoad = async ({ url, locals: { supabase, safeGetSession }, fetch, cookies }) => {

    const { session, user } = await safeGetSession();

    let spellsCombined;

    try {
        const indexPage = await fetch('http://127.0.0.1:8080/spells/index.json');

        const files = await indexPage.json();
        const spellFiles = await Promise.all(
            Object.values(files).map(n => fetch(`http://127.0.0.1:8080/spells/${n}`))
        );
        // TEMPORARY ADD ALL KIBBLE ELEMENTAL SPELLS
        const kibblePage = await fetch("https://raw.githubusercontent.com/TheGiddyLimit/homebrew/master/spell/KibblesTasty%3B%20Kibbles'%20Generic%20Elemental%20Spells.json");
        spellFiles.push(kibblePage);

        const spellJsons = await Promise.all(spellFiles.map(x => x.json()));

        spellsCombined = spellJsons.flatMap(x => x['spell']);
    } catch (e) {
        console.log("oopsie woopsie - no spells", e);
    }
    

    return {
        session,
        user,
        spells: spellsCombined,
        cookies: cookies.getAll(),
    };
};