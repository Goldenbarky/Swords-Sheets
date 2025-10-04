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

    let sourcebookData:SourcebookDataStructs = {
        spellsList: [],
        spellsByClass: {},
        classes: [],
        bookNames: []
    };

    try {

        // To be fixed by aven before 12/31/2025

        const indexPage = await fetch('http://127.0.0.1:8080/spells/index.json');

        // Get spells from every source
        const files = await indexPage.json();
        const spellFiles = await Promise.all(
            Object.values(files).map(n => fetch(`http://127.0.0.1:8080/spells/${n}`))
        );

        // TEMPORARY ADD ALL KIBBLE ELEMENTAL SPELLS
        const kibblePage = await fetch("https://raw.githubusercontent.com/TheGiddyLimit/homebrew/master/spell/KibblesTasty%3B%20Kibbles'%20Generic%20Elemental%20Spells.json");
        spellFiles.push(kibblePage);

        // Get spell-class lookup table
        const spellJsons = await Promise.all(spellFiles.map(x => x.json()));
        const spellClassPage = await fetch('http://127.0.0.1:8080/generated/gendata-spell-source-lookup.json');

        // Get classes from every source
        const classesIndex = await fetch('http://127.0.0.1:8080/class/index.json');
        const classFiles = await Promise.all(
            Object.values(await classesIndex.json()).map(n => fetch(`http://127.0.0.1:8080/class/${n}`))
        );
        const classJsons = await Promise.all(classFiles.map(x => x.json()));

        // Get bookID-name lookup table
        const bookPage = await (await fetch('http://127.0.0.1:8080/books.json')).json();
        const adventurePage = await (await fetch('http://127.0.0.1:8080/adventures.json')).json();

        // Populate sourcebook struct
        sourcebookData.spellsList = spellJsons.flatMap(x => x['spell']);
        sourcebookData.spellsByClass = await spellClassPage.json();

        // Add only relevant class data
        sourcebookData.classes = classJsons.map(cls => ({"Name": cls["class"][0]["name"], "Subclasses": ([... new Set(cls["subclass"]?.map((subcls:{"name":string}) => subcls["name"]))]) as string[]}))
        
        // Add only relevant book data
        let bookMap = bookPage["book"].map(book => ({id: book["source"].toLowerCase(), name: book["name"]}));
        let adventureMap = adventurePage["adventure"].map(adventure => ({id: adventure["source"].toLowerCase(), name: adventure["name"]}));
        sourcebookData.bookNames = bookMap.concat(adventureMap);
    
    } catch (e) {
        console.log("oopsie woopsie - no spells", e);
    }
    

    return {
        session,
        user,
        sourcebookData: sourcebookData,
        cookies: cookies.getAll(),
    };
};