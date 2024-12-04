
import { browser } from '$app/environment';
import { PUBLIC_SITE_URL } from '$env/static/public';
import type { Session, User } from '@supabase/gotrue-js';
import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { getContext, setContext } from 'svelte';
import ThemeTemplate from '$lib/Data/ThemeTemplate.json';
import { createNewCampaign, createNewCharacter, skill_score_dictionary } from './GenericFunctions';
import { Calculation } from './Components/Classes/DataClasses';

export class CharacterSheetController {
    #character: CharacterDataRow = $state()!;

    mode: 'view' | 'use' | 'edit' = $state('view');

    static bonusToString(bonus: number): string {
        return `${bonus >= 0 ? "+" : ""}${bonus.toString()}`;
    }

    static getCharacterController(): CharacterSheetController {
        return getContext('charactercontroller');
    }

    static levelToProficiencyBonus(level: number): number {
        return Math.floor((level + 3) / 4) + 1;
    }

    static scoreToModifier(score: number): number {
        return Math.floor(score / 2) - 5;
    }

    static setCharacterController(controller: CharacterSheetController) {
        setContext('charactercontroller', controller);
    }

    constructor(characterRow: CharacterDataRow) {
        this.#character = characterRow;
    }

    get character(): CharacterDataRow {
        return this.#character;
    }
    
    calcBonus(
        ability: keyof AbilityScoreType,
        proficiency: string,
    ): Calculation {
        let maths = new Calculation();
    
        maths.addVariables({ name: ability, bonus: CharacterSheetController.scoreToModifier(this.#character.data.Stats.Ability_Scores[ability]) });
    
        if (proficiency === "P") maths.addVariables({ name: "Proficiency", bonus: this.getProficiencyBonus() });
        else if (proficiency === "E") maths.addVariables({ name: "Expertise", bonus: this.getProficiencyBonus() * 2 });
    
        return maths;
    }

    getAbilityModifier(ability: keyof AbilityScoreType): number {
        return CharacterSheetController.scoreToModifier(this.#character.data.Stats.Ability_Scores[ability]);
    }
    
    getArmorClass() {
        let maths = new Calculation();
    
        let armor = this.#character.data.Equipment.Armor;
        let ability_bonus = this.calcBonus(armor.Ability, "").total;
        let enhancements = this.#character.data.Equipment.Shields;
    
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

    getPassiveBonus(skill: keyof SkillProficiencyType) {
        let maths = new Calculation();
    
        maths.addVariables({ name:"Base", bonus:10 });
        let observant = this.#character.data.Features.Feats.find(x => x.Title === "Observant");
    
        maths.join(this.getSkillBonus(skill));
    
        if (["Investigation", "Perception"].includes(skill) && observant) {
            maths.addVariables({ name: "Observant", bonus: 5 });
        }
    
        return maths;
    }

    getProficiencyBonus(): number {
        let level = Number(this.#character.data.Level);

        return CharacterSheetController.levelToProficiencyBonus(level);
    }

    getSavingBonus(saving_throw: keyof AbilityScoreType): Calculation {
        let proficiency = this.#character.data.Stats.Proficiencies.Saving_Throws[saving_throw];
    
        let maths = this.calcBonus(saving_throw, proficiency);
        this.#character.data.Equipment.Shields.forEach(shield => maths.addVariables({
            name: shield.Name, 
            bonus: Number(shield.Saving_Throw_Mods[saving_throw])
        }));
    
        return maths;
    }

    getSaveDc(): Calculation {
        let maths = new Calculation();

        maths.addVariables({ name:"Base", bonus:8 });
        
        maths.join(this.getSpellToHitBonus());

        return maths;
    }

    getSkillBonus(skill: keyof SkillProficiencyType): Calculation {
        let proficiency = this.character.data.Stats.Proficiencies.Skills[skill];
        let score: keyof AbilityScoreType = skill_score_dictionary[skill] as keyof AbilityScoreType;
    
        return this.calcBonus(score, proficiency);
    }

    getSpellToHitBonus() {
        let maths = new Calculation();
    
        let ability = this.#character.data.Spellcasting.Ability as keyof AbilityScoreType;
        let ability_mod = CharacterSheetController.scoreToModifier(this.#character.data.Stats.Ability_Scores[ability]);
    
        maths.addVariables({ name: ability, bonus: ability_mod });
        maths.addVariables({ name: "Proficiency", bonus: this.getProficiencyBonus() });
        maths.addVariables({ name: "Magic Item", bonus: this.#character.data.Spellcasting.Bonus });
    
        return maths;
    }
    
    getWeaponToHitBonus = (weapon:Weapon) => {
        let proficiency_bonus = this.getProficiencyBonus();
        let modifier = this.getAbilityModifier(weapon.Ability);
    
        let maths = new Calculation();
    
        maths.addVariables({ name: weapon.Ability, bonus: modifier });
        if (weapon.Proficient) {
            maths.addVariables({ name: "Proficiency", bonus: proficiency_bonus });
        }
        maths.addVariables({ name: "Magic Item", bonus: weapon.Bonus });
        
        return maths;
    }
}

export class SiteState {
    #campaign: CampaignDataRow | null = $state(null);
    #characterController: CharacterSheetController | null = $state(null);
    #dbCtx: DatabaseClient;
    #originalTheme: Theme = ThemeTemplate;
    #saveStatus: 'NOT' | 'SAVING' | 'FAILED' | 'SUCCEEDED' = $state('NOT');
    
    characterSheet = $derived(this.#characterController?.character.data);
    theme = $derived(this.#characterController?.character.theme ?? this.#originalTheme);

    static getSiteState(): SiteState {
        return getContext<SiteState>('sitestate');
    }

    static setSiteState(siteState: SiteState) {
        setContext('sitestate', siteState);
    }

    constructor(dbCtx: DatabaseClient) {
        this.#dbCtx = dbCtx;
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
            this.#saveStatus = !!resp ? 'SUCCEEDED' : 'FAILED';
            return resp;
        }

        if (this.#campaign) {
            const resp = await this.#dbCtx.saveCampaign(this.#campaign);
            this.#saveStatus = !!resp ? 'SUCCEEDED' : 'FAILED';
            return resp;
        }

        console.trace('trying to save with no data', this);
        return null;
    }

    async pullCharacter(name: string): Promise<CharacterSheetController | null> {
        const character = await this.#dbCtx.getCharacterByName(name);

        if (!!character) {
            this.#characterController = new CharacterSheetController(character);
        }
        this.#originalTheme = this.#characterController?.character.theme ?? ThemeTemplate;
        return this.#characterController;
    }

    async pullCampaign(id: string): Promise<CampaignDataRow | null> {
        const campaign = await this.#dbCtx.getCampaignById(id);

        this.#campaign = campaign;
        this.#originalTheme = this.#campaign?.theme ?? ThemeTemplate;
        return this.#campaign;
    }

    resetTheme() {
        if (this.#characterController) {
            this.#characterController.character.theme = this.#originalTheme;
            return;
        }

        if (this.#campaign) {
            this.#campaign.theme = this.#originalTheme;
        }
    }
}

export class DatabaseClient {
    #db: SupabaseClient;
    #session: Session | null = $state(null);
    #user: User | null = $state(null);

    static getDatabaseClient(): DatabaseClient {
        return getContext<DatabaseClient>('database');
    }

    static setDatabaseClient(db: DatabaseClient) {
        setContext('database', db);
    }

    constructor(db: SupabaseClient, session?: Session | null, user?: User | null) {
        this.#db = db;
        this.#session = session!;
        this.#user = user!;
        
        if (browser) {
            this.#db.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_OUT' || !session) {
                    this.#user = null;
                }

                if (session) {
                    this.#session = session;
                    this.#user = session.user;
                }
            });
        }
    }

    get session() {
        return this.#session;
    }

    get user() {
        return this.#user;
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

        if (!!error) {
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

        if (!!error) {
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
