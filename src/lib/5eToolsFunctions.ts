export const getClassSpellList = (spellsByClass:SourcebookDataStructs["spellsByClass"], mainClass:string, subClass:string = "", subClassOnly:boolean = false, sourcebooks:Record<string, boolean>) => {
    let spells:{name:string, source:string}[] = [];
    
    // Loop over spell source
    let approvedSources = Object.entries(sourcebooks).filter(x => x[1]).map(x => x[0]);

    for (const source of approvedSources) {
        let spellList = Object.entries(spellsByClass[source]);

        // Loop over spells
        spell_for: for(const [spell_name, source_info] of spellList) {
            if(!subClassOnly) {
                // Search for Class
                let validClasses = [... new Set(Object.entries(source_info.class??{})?.flatMap(([source_id, class_list]) => Object.keys(class_list)))];
                
                if(validClasses.find(x => x === mainClass)) {
                    spells.push({name: spell_name, source: source.toLowerCase()});
                    continue;
                }

                // Search for Variant Class rules
                let variantClasses = [... new Set(Object.entries(source_info.classVariant??{})?.flatMap(([source_id, variant_list]) => Object.keys(variant_list)))];
                if(variantClasses.find(x => x === mainClass)) {
                    spells.push({name: spell_name, source: source.toLowerCase()});
                    continue;
                }
            }
            
            if(subClass !== "") {
                // Search for Subclass
                let classSources = Object.entries(source_info.subclass??{})
                for(const [source_name, classes] of classSources) {
                    let subclassSourcesByClass = Object.entries(classes)
                    for(const [class_name, subclass_sources] of subclassSourcesByClass) {
                        let subclassesBySource = Object.entries(subclass_sources)
                        for(const [subclass_source_name, subclasses] of subclassesBySource) {
                            for(const subclass_struct of Object.values(subclasses)) {
                                if(subclass_struct.name === subClass) {
                                    spells.push({name: spell_name, source: source.toLowerCase()});
                                    continue spell_for;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return spells;
}