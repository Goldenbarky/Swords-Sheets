
import { browser } from '$app/environment';
import { PUBLIC_SITE_URL, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Session, User } from '@supabase/gotrue-js';
import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { getContext, setContext } from 'svelte';
import ThemeTemplate from '$lib/Data/ThemeTemplate.json';
import { createNewCampaign, createNewCharacter, skill_score_dictionary } from './GenericFunctions';
import { Calculation } from './Components/Classes/DataClasses';
import { uuid } from '@supabase/gotrue-js/dist/module/lib/helpers';
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { invalidate } from '$app/navigation';

export class CampaignController {
    readonly #campaign: CampaignDataRow = $state()!;

    mode: 'view' | 'use' | 'edit' = $state('view');

    constructor(campaignRow: CampaignDataRow) {
        this.#campaign = campaignRow;
    }

    setContext() {
        setContext('campaignController', this);
    }

    static getContext(): CampaignController {
        let v = getContext<CampaignController>('campaignController');
        if (!v) console.trace('campaign controller is not in context yet');
        return v;
    }

    get campaign() {
        return this.#campaign;
    }
}

export class CharacterController {
    readonly #character: CharacterDataRow = $state()!;

    mode: 'view' | 'use' | 'edit' = $state('view');

    static bonusToString(bonus: number): string {
        return `${bonus >= 0 ? "+" : ""}${bonus.toString()}`;
    }

    static calcArmorClass(characterSheet: CharacterSheet): Calculation {
        let maths = new Calculation();
    
        let armor = characterSheet.Equipment.Armor;
        let ability_bonus = CharacterController.calcBonus(characterSheet, armor.Ability, "").total;
        let enhancements = characterSheet.Equipment.Shields;
    
        maths.addVariables({ name: armor.Name, bonus: Number(armor.Base) + Number(armor.Bonus) })
    
        // @ts-expect-error this is until we migrate all armors to be pure numbers
        if (armor.Limit === "" || (Number(armor.Limit) !== 0 && ability_bonus <= Number(armor.Limit))) {
            maths.addVariables({ name: armor.Ability, bonus: Number(ability_bonus) });
        }
        else { 
            maths.addVariables({ name: armor.Ability, bonus: Number(armor.Limit) });
        }
    
        enhancements.forEach(shield => {
            maths.addVariables({ name: shield.Name, bonus: Number(shield.Base) + Number(shield.Bonus) });
        });
    
        return maths;
    }

    static calcBonus(
        characterSheet: CharacterSheet,
        ability: keyof AbilityScoreType,
        proficiency: string,
    ): Calculation {
        let maths = new Calculation();
    
        maths.addVariables({ name: ability, bonus: CharacterController.scoreToModifier(characterSheet.Stats.Ability_Scores[ability]) });
    
        if (proficiency === "P") maths.addVariables({ name: "Proficiency", bonus: CharacterController.getProficiencyBonus(characterSheet) });
        else if (proficiency === "E") maths.addVariables({ name: "Expertise", bonus: CharacterController.getProficiencyBonus(characterSheet) * 2 });
    
        return maths;
    }

    static calcPassiveBonus(characterSheet: CharacterSheet, skill: keyof SkillProficiencyType): Calculation {
        let maths = new Calculation();
    
        maths.addVariables({ name:"Base", bonus:10 });
        let observant = characterSheet.Features.Feats.find(x => x.Title === "Observant");
    
        maths.join(CharacterController.calcSkillBonus(characterSheet, skill));
    
        if (["Investigation", "Perception"].includes(skill) && observant) {
            maths.addVariables({ name: "Observant", bonus: 5 });
        }
    
        return maths;
    }

    static calcSaveDc(characterSheet: CharacterSheet): Calculation {
        let maths = new Calculation();

        maths.addVariables({ name:"Base", bonus:8 });
        
        maths.join(CharacterController.calcSpellToHit(characterSheet));

        return maths;
    }

    static calcSavingBonus(characterSheet: CharacterSheet, savingThrow: keyof AbilityScoreType) {
        let proficiency = characterSheet.Stats.Proficiencies.Saving_Throws[savingThrow];
    
        let maths = CharacterController.calcBonus(characterSheet, savingThrow, proficiency);
        characterSheet.Equipment.Shields.forEach(shield => maths.addVariables({
            name: shield.Name, 
            bonus: Number(shield.Saving_Throw_Mods[savingThrow])
        }));
    
        return maths;
    }
    
    static calcSkillBonus(characterSheet: CharacterSheet, skill: keyof SkillProficiencyType): Calculation {
        let proficiency = characterSheet.Stats.Proficiencies.Skills[skill];
        let score: keyof AbilityScoreType = skill_score_dictionary[skill] as keyof AbilityScoreType;
    
        return CharacterController.calcBonus(characterSheet, score, proficiency);
    }

    static calcSpellToHit(characterSheet: CharacterSheet): Calculation {
        let maths = new Calculation();
    
        let ability = characterSheet.Spellcasting.Ability as keyof AbilityScoreType;
        let ability_mod = CharacterController.scoreToModifier(characterSheet.Stats.Ability_Scores[ability]);
    
        maths.addVariables({ name: ability, bonus: ability_mod });
        maths.addVariables({ name: "Proficiency", bonus: CharacterController.getProficiencyBonus(characterSheet) });
        maths.addVariables({ name: "Magic Item", bonus: characterSheet.Spellcasting.Bonus });
    
        return maths;
    }

    static calcWeaponToHit(characterSheet: CharacterSheet, weapon: Weapon): Calculation {
        let proficiency_bonus = CharacterController.getProficiencyBonus(characterSheet);
        let modifier = CharacterController.getAbilityModifier(weapon.Ability, characterSheet);
    
        let maths = new Calculation();
    
        maths.addVariables({ name: weapon.Ability, bonus: modifier });
        if (weapon.Proficient) {
            maths.addVariables({ name: "Proficiency", bonus: proficiency_bonus });
        }
        maths.addVariables({ name: "Magic Item", bonus: weapon.Bonus });
        
        return maths;
    }
    
    static getAbilityModifier(ability: keyof AbilityScoreType, characterSheet: CharacterSheet): number {
        return CharacterController.scoreToModifier(characterSheet.Stats.Ability_Scores[ability]);
    }

    static getProficiencyBonus(characterSheet: CharacterSheet): number {
        let level = Number(characterSheet.Level);

        return CharacterController.levelToProficiencyBonus(level);
    }

    static levelToProficiencyBonus(level: number): number {
        return Math.floor((level + 3) / 4) + 1;
    }

    static scoreToModifier(score: number): number {
        return Math.floor(score / 2) - 5;
    }

    constructor(characterRow: CharacterDataRow) {
        this.#character = characterRow;
    }

    setContext() {
        setContext('characterController', this);
    }

    static getContext(): CharacterController {
        let v = getContext<CharacterController>('characterController');
        if (!v) console.trace('character controller is not in context yet');
        return v;
    }

    get character(): CharacterDataRow {
        return this.#character;
    }
    
    calcBonus(
        ability: keyof AbilityScoreType,
        proficiency: string,
    ): Calculation {
        return CharacterController.calcBonus(this.#character.data, ability, proficiency);
    }

    getAbilityModifier(ability: keyof AbilityScoreType): number {
        return CharacterController.getAbilityModifier(ability, this.#character.data);
    }
    
    getArmorClassCalc(): Calculation {
        return CharacterController.calcArmorClass(this.#character.data);
    }

    getPassiveBonusCalc(skill: keyof SkillProficiencyType): Calculation {
        return CharacterController.calcPassiveBonus(this.#character.data, skill);
    }

    getProficiencyBonus(): number {
        return CharacterController.getProficiencyBonus(this.#character.data);
    }

    getSaveDcCalc(): Calculation {
        return CharacterController.calcSaveDc(this.#character.data);
    }
    
    getSavingBonusCalc(saving_throw: keyof AbilityScoreType): Calculation {
        return CharacterController.calcSavingBonus(this.#character.data, saving_throw);
    }

    getSkillBonusCalc(skill: keyof SkillProficiencyType): Calculation {
        return CharacterController.calcSkillBonus(this.#character.data, skill);
    }

    getSpellToHitBonusCalc(): Calculation {
        return CharacterController.calcSpellToHit(this.#character.data);
    }
    
    getWeaponToHitBonusCalc(weapon:Weapon): Calculation {
        return CharacterController.calcWeaponToHit(this.#character.data, weapon);
    }
}

export class SiteState {
    readonly #dbCtx: DatabaseClient;
    
    #campaignController: CampaignController | null = $state(null);
    #characterController: CharacterController | null = $state(null);
    #originalTheme: Theme = ThemeTemplate;
    #saveStatus: 'NOT' | 'SAVING' | 'FAILED' | 'SUCCEEDED' = $state('NOT');
    
    characterSheet = $derived(this.#characterController?.character.data);
    theme = $derived(this.#characterController?.character.theme ?? this.#originalTheme);

    setContext() {
        setContext('siteState', this);
    }

    static getContext(): SiteState {
        let v = getContext<SiteState>('siteState');
        if (!v) console.trace('database is not in context yet');
        return v;
    }

    constructor(dbCtx: DatabaseClient) {
        this.#dbCtx = dbCtx;
    }

    get campaignController() {
        return this.#campaignController;
    }

    get characterController() {
        return this.#characterController;
    }

    get saveStatus() {
        return this.#saveStatus;
    }

    async save(): Promise<PostgrestSingleResponse<any[]> | null> {
        if (this.#saveStatus === 'SAVING') return null;

        this.#saveStatus = 'SAVING';
        if (this.#characterController) {
            const resp = await this.#dbCtx.saveCharacter(this.#characterController.character);
            this.#saveStatus = resp ? 'SUCCEEDED' : 'FAILED';
            return resp;
        }

        if (this.#campaignController) {
            const resp = await this.#dbCtx.saveCampaign(this.#campaignController.campaign);
            this.#saveStatus = resp ? 'SUCCEEDED' : 'FAILED';
            return resp;
        }

        console.trace('trying to save with no data', this);
        return null;
    }

    async pullCharacter(name: string): Promise<CharacterController | null> {
        const character = await this.#dbCtx.getCharacterByName(name);

        if (character) {
            console.log(character);
            this.#characterController = new CharacterController(character);
        }
        this.#originalTheme = $state.snapshot(this.#characterController?.character.theme) ?? ThemeTemplate;
        return this.#characterController;
    }

    async pullCampaign(id: string): Promise<CampaignController | null> {
        const campaign = await this.#dbCtx.getCampaignById(id);

        if (campaign) {
            this.#campaignController = new CampaignController(campaign);
        }
        this.#originalTheme = $state.snapshot(this.#campaignController?.campaign.theme) ?? ThemeTemplate;
        return this.#campaignController;
    }

    resetTheme() {
        if (this.#characterController) {
            this.#characterController.character.theme = structuredClone(this.#originalTheme);
            return;
        }

        if (this.#campaignController) {
            this.#campaignController.campaign.theme = structuredClone(this.#originalTheme);
        }
    }
}

type Cookies = Array<{
    name: string;
    value: string;
}>;

type Fetch = {
    (input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
    (input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>;
};

export class DatabaseClient {
    #db: SupabaseClient;
    readonly #fetch: Fetch;
    readonly #cookies: Cookies;
    #session: Session | null = $state(null);
    #user: User | null = $state(null);

    setContext() {
        setContext('database', this);
    }

    static getContext(): DatabaseClient {
        let v = getContext<DatabaseClient>('database');
        if (!v) console.trace('database is not in context yet');
        return v;
    }

    constructor(user: User | null, cookies: Cookies, fetch: Fetch) {
        this.#user = user!;
        this.#fetch = fetch;
        this.#cookies = cookies;

        this.#db = this.#createClients();
    }

    #createClients() {
        let cookies = this.#cookies;
        let fetch = this.#fetch;
        return isBrowser()
        ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            global: {
                fetch,
            },
        })
        : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            global: {
                fetch,
            },
            cookies: {
                getAll() {
                    return cookies;
                },
            },
        });
    }

    setupHooks(): () => void {
        const { data } = this.#db.auth.onAuthStateChange((_, newSession) => {
            if (newSession?.expires_at !== this.#session?.expires_at) {
                this.#db = this.#createClients();
            }
            this.#session = newSession;
            this.#user = newSession?.user!;
        });

        return data.subscription.unsubscribe;
    }

    get session() {
        return this.#session;
    }

    get user() {
        return this.#user;
    }

    async getSession(): Promise<Session | null> {
        return (await this.#db.auth.getSession()).data.session;
    }

    async getAllCampaigns(): Promise<CampaignDataRow[] | null> {
        const { data: campaigns, error } = await this.#db
            .from("campaigns")
            .select("*");

        if (!campaigns || !!error) {
            console.error('failed to get all campaigns', campaigns, error);
        }

        return campaigns;
    }

    async getAllCharacters(): Promise<CharacterDataRow[] | null> {
        const { data: characters, error } = await this.#db
            .from("characters")
            .select("*");

        if (!characters || !!error) {
            console.error('failed to get all characters', characters, error);
        }

        return characters;
    }

    async getAllUsers(): Promise<{ id: string; display_name: string; }[] | null> {
        const { data: users, error } = await this.#db
            .from("users")
            .select("*");

        if (!users || !!error) {
            console.error('failed to get all users', users, error);
        }

        return users;
    }

    async getCampaignById(id: string): Promise<CampaignDataRow | null> {
        const { data: campaign, error } = await this.#db
            .from("campaigns")
            .select("*")
            .eq("id", id)
            .single<CampaignDataRow>();

        if (!campaign || !!error) {
            console.error('failed to get campaign', id, error);
        }

        return campaign;
    }

    async getCampaignInvitesForCharacterId(character_id: string): Promise<CampaignDataRow[] | null> {
        if (!this.#user) {
            console.error('unable to get invites for character without user', this);
            return null;
        }

        const { data: campaign_ids, error: e1 } = await this.#db
            .from("campaign_invites")
            .select("campaign_id")
            .eq("character_invited", character_id);

        if (!campaign_ids || !!e1) {
            console.error('failed to get campaign ids for character', character_id, e1);
            return null;
        }

        if (campaign_ids.length <= 0) return null;

        const { data: campaigns, error: e2 } = await this.#db
            .from("campaigns")
            .select("*")
            .in("id", campaign_ids.map(x => x.campaign_id));

        if (!campaigns || !!e2) {
            console.error('failed to get campaign', character_id, e2);
        }

        return campaigns;
    }

    async getCharacterByName(name: string): Promise<CharacterDataRow | null> {
        const { data: character, error } = await this.#db
            .from("characters")
            .select("*")
            .eq("name", name)
            .single<CharacterDataRow>();
        if (browser && !character || !!error) {
            console.error('failed to acquire character', name, error);
        }

        return character;
    }

    async getCharactersByIds(ids: string[]): Promise<CharacterDataRow[] | null> {        
        const { data: characters, error } = await this.#db
            .from("characters")
            .select("*")
            .in("id", ids);

        if (!characters || !!error) {
            console.error('failed to get characters', characters, error);
        }

        return characters;
    }
    
    async inviteCharactersToCampaign(
        campaign_id: string, 
        character_ids: string[]
    ): Promise<boolean> {
        if (!this.#user) {
            console.trace('unable to invite characters to campaign without user', this);
            return false;
        }

        const { error } = await this.#db
            .from("campaign_invites")
            .upsert(character_ids.map(id => ({
                campaign_id: campaign_id,
                character_invited: id,
            })));

        if (error) {
            console.error('failed to invite characters', error);
            return false;
        }
        return true;
    }

    async inviteCharacterToCampaign(
        campaign_id: string, 
        character_id: string
    ): Promise<boolean> {
        if (!this.#user) {
            console.trace('unable to invite character to campaign without user', this);
            return false;
        }

        const { error } = await this.#db
            .from("campaign_invites")
            .upsert({
                campaign_id: campaign_id,
                character_invited: character_id,
            });

        if (error) {
            console.error('failed to invite character', error);
            return false;
        }
        return true;
    }

    async saveCampaign(campaign: CampaignDataRow): Promise<PostgrestSingleResponse<any[]> | null> {
        if (!this.#user) {
            console.trace('unable to save without user', this);
            return null;
        }

        const resp = await this.#db
            .from("campaigns")
            .update({ data: campaign.data, theme: campaign.theme })
            .eq("id", campaign.id)
            .select('*');

        return resp;
    }

    async saveCharacter(character: CharacterDataRow): Promise<PostgrestSingleResponse<any[]> | null> {
        if (!this.#user) {
            console.trace('unable to save without user', this);
            return null;
        }

        const resp = await this.#db
            .from("characters")
            .update({ data: character.data, theme: character.theme })
            .eq("id", character.id)
            .select('*');
        return resp;
    }

    async signInWithGoogle() {
        if (process.env.PW_TEST_USERNAME && process.env.PW_TEST_PASSWORD) {
            await this.#db.auth.signInWithPassword({
                email: process.env.PW_TEST_USERNAME,
                password: process.env.PW_TEST_PASSWORD
            });
        } else {
            await this.#db.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${PUBLIC_SITE_URL}${window.location.pathname.substring(1)}`,
                },
            });
        }
    }

    async upsertNewCampaign(
        campaign_name: string, 
        campaign_level: number, 
        characters:string[]
    ): Promise<CampaignDataRow | null> {
        if (!this.#user) {
            console.trace('unable to upsert campaign without user', this);
            return null;
        }

        let { data: campaign, error } = await this.#db
            .from("campaigns")
            .upsert({
                name: campaign_name,
                data: createNewCampaign(
                    characters,
                    campaign_level
                ),
            })
            .select('*')
            .single<CampaignDataRow>();
        
        if (!campaign || !!error) {
            console.error('failed to create and upsert campaign', campaign, error);
            return null;
        }

        await this.inviteCharactersToCampaign(campaign.id, characters);
    
        return campaign;
    }

    async upsertNewCharacter(
        character_class: string, 
        character_level: number, 
        character_name: string
    ): Promise<CharacterDataRow | null> {
        const { data: character, error } = await this.#db
            .from("characters")
            .upsert({
                data: createNewCharacter(
                    character_class,
                    character_level,
                    character_name,
                ),
                name: character_name,
            })
            .select('*')
            .single<CharacterDataRow>();
    
        if (!character || !!error) {
            console.error('failed to create and upsert character', character, error);
            return null;
        }
        return character;
    }
}
