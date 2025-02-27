<script lang="ts">
    interface Props {
        entries: any[];
        upcast: string;
        level: number;
    }

    let { entries, upcast, level }: Props = $props();

    let damageDetails:{
        base:number,
        dieSize:number,
        scale:number,
        damage:number,
    }[] = $state([]);

    let paragraphs:string|object[] = [];
    entries.forEach(x => (x.type !== "quote") ? paragraphs.push(x) : "");

    const r = /(?:{@(\w+) ([\w ]+)[^}]*})|(?:Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)(?= saving throw)|(penetrate)/;
    const upscaleRegex = /[A-Z][^.]*{@scaledamage.+\|\S+\|\S+}[^.]*\./g;
    const scaleRegex = /{@scaledamage (\d+)d(\d+).*\|.+\|(\d)d\d+}/g;
    const diceRegex = /(\d+)d(\d+)/;

    type FormattedDesc = (string | { type: 'highlighted'; value: string; } | { type: 'bold'; value: string; } | { type: 'damage'; value: string; damageIndex: number; } | { type: 'newline' });

    const formatParagraph = (paragraph:string|object, indexKey:number, formatted: FormattedDesc[]): number => {
        let newIndex = indexKey;
        try {
            if (typeof paragraph === "object") {
                if (paragraph.type === 'entries') {
                    if (paragraph.name) {
                        formatted.push({ value: `${paragraph.name} `, type: 'bold' })
                    }
                    paragraph.entries.forEach(x => {
                        newIndex = formatParagraph(x, newIndex, formatted);
                    });
                } else if (paragraph.type === 'list') {
                    paragraph.items.forEach(x => {
                        newIndex = formatParagraph(`• ${x}`, newIndex, formatted);
                        formatted.push({ type: 'newline' });
                    });
                } else {
                    formatted.push({type: 'bold', value: `Bad type: ${paragraph.type}`});
                }
                return newIndex;
            }

            let m = r.exec(paragraph)
            if(m == null) {
                formatted.push(paragraph);
                return newIndex + 1;
            }

            while(m !== null) {
                let type = m[1];
                let text = m[2];

                if(type === "scaledamage") {
                    let scaleSentence = upscaleRegex.exec(paragraph);

                    if(scaleSentence !== null) {
                        let scaleTag = scaleRegex.exec(scaleSentence[0]);

                        while (scaleTag !== null) {
                            let baseNumber = scaleTag[1];
                            let baseSize = scaleTag[2];
                            let scaleNumber = Number.parseInt(scaleTag[3]);

                            let index = damageDetails.findIndex(x => x.base.toString() === baseNumber && x.dieSize.toString() === baseSize);
                            if(index !== -1) {
                                damageDetails[index].scale = scaleNumber;
                            } else {
                                damageDetails[index].scale = -100;
                            }

                            scaleTag = scaleRegex.exec(scaleSentence[0]);
                        }

                        paragraph = paragraph.replace(scaleSentence[0], "");
                        formatted.push(paragraph);
                        formatted.push("");
                    }
                } else {
                    let results = paragraph.split(m[0], 2);
                    paragraph = paragraph.replace(results[0] + m[0], "");

                    if(type === "damage") {
                        formatted.push(results[0]);

                        let diceMatch = diceRegex.exec(text);

                        if(diceMatch == null) formatted.push("error");
                        else {
                            let base = Number.parseInt(diceMatch[1]);
                            let dieSize = Number.parseInt(diceMatch[2]);
                            let scale = 0;
                            let damage = base;

                            let duplicateDamage = damageDetails.findIndex(x => x.dieSize === dieSize && x.base === base);
                            if(duplicateDamage !== -1) {
                                formatted.push({ type: 'damage', value: "d" + dieSize, damageIndex: duplicateDamage });

                                m = r.exec(paragraph);
                                continue;
                            }

                            damageDetails.push({base, dieSize, scale, damage});
                            formatted.push({ type: 'damage', value: "d" + dieSize, damageIndex: damageDetails.length - 1});
                        }
                    }
                    else if(type == undefined || type === "condition" || type === "dice" || type === "damage") {
                        formatted.push(results[0]);

                        if(type == undefined) formatted.push({ type: 'highlighted', value: m[0] });
                        else formatted.push({ type: 'highlighted', value: text });
                    }
                    else if (type === "chance") {
                        formatted.push(results[0]);
                        formatted.push({ type: 'highlighted', value: text + ' percent' });
                    }
                    else {
                        formatted.push(results[0] + text);
                    }
                }
                
                m = r.exec(paragraph);
            }

            if(paragraph !== "") formatted.push(paragraph);
        } catch (e) {
            console.log(e);
            formatted.push('error');
        }
        

        return newIndex + 1;
    }

    let formattedDescription:FormattedDesc[][] = [];
    paragraphs.forEach((x, i) => {
        let formattedParagraph: string[] = [];
        formatParagraph(x, i, formattedParagraph);
        formattedDescription.push(formattedParagraph);
    });

    let formattedUpcast: string[] = [];
    formatParagraph(upcast, 0, formattedUpcast);

    let active:number = $state(level);
</script>
{#each formattedDescription as paragraph, i}
    <p>
        {#each paragraph as entry, j (`${i}${j}`)}
            {#if entry?.type === 'highlighted'}
                <span class="highlighted">{entry.value}</span>
            {:else if entry?.type === 'damage'}
                <span class="highlighted">{damageDetails[entry.damageIndex].damage}{entry.value}</span>
            {:else if entry?.type === 'bold'}
                <span class="upcast">{entry.value}</span>
            {:else if entry?.type === 'newline'}
                <br>
            {:else}
                {entry}
            {/if}
        {/each}
    </p>
    {#if (i != paragraphs.length - 1)}<div style="height:0.5rem;"></div> {/if}
{/each}
{#if upcast != ""}
{@const formatted = formattedUpcast}
    {#if formatted[0] !== ""}
        <div style="height:0.5rem;"></div>
        <p>
            <span class="upcast">At Higher Levels.</span>
            {#each formatted as entry, i}
                {#if entry?.type === 'damage' || entry?.type === 'highlighted'}
                    <span class="highlighted">{entry.value}</span>
                {:else if entry?.type === 'bold'}
                    <span class="upcast">{entry.value}</span>
                {:else if entry?.type === 'newline'}
                    <br>
                {:else}
                    {entry}
                {/if}
            {/each}
        </p>
    {/if}
    {#if damageDetails.find(x => x.scale !== 0) !== undefined}
        <div class="row">
            {#each Array(9 - level + 1) as _, i}
                <!-- svelte-ignore a11y_missing_attribute, a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
                <div class="spell-detail" class:is-active={active===(level + i)} onclick={() => {
                    active = (level + i);
                    damageDetails.forEach(x => {
                        x.damage = x.base + (x.scale * i);
                    });
                    damageDetails = damageDetails;
                }}>{level + i}</div>
            {/each}
        </div>
    {/if}
{/if}

<style>
    p {
        font-size: small;
        text-align: left;
        color: var(--text);
    }
    .highlighted {
        color: var(--secondary);
    }
    .upcast {
        font-weight: bold;
        color: var(--secondary);
    }
    .row {
        display: flex;
        width: fit-content;
        flex-wrap: wrap;
        justify-content: center;
    }
    .spell-detail{
        outline: 1.5px solid var(--border);
        border-radius: 35%;
        width: 1.2rem;
        height: 1.2rem;
        font-size: small;
        font-weight: 500;
        display: inline-block;
        justify-items: center;
        justify-content: center;
        align-items: center;
        padding-bottom: 20px;
        margin-left: 0.5rem;
        margin-top: 0.5rem;
        color: var(--secondary);
        user-select: none;
    }
    .spell-detail:hover  {
        background-color: var(--text);
    }
    .is-active {
        outline-color: var(--secondary);
    }
</style>