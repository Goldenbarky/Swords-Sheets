
import { browser } from '$app/environment';
import { PUBLIC_SITE_URL } from '$env/static/public';
import type { Session, User } from '@supabase/gotrue-js';
import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { getContext } from 'svelte';
import ThemeTemplate from '$lib/Data/ThemeTemplate.json';

export class SiteState {
    character: CharacterDataRow | null = $state(null);
    campaign: CampaignDataRow | null = $state(null);
    saveStatus: 'NOT' | 'SAVING' | 'FAILED' | 'SUCCEEDED' = $state('NOT');

    #dbCtx: DatabaseClient;
    #originalTheme: Theme = ThemeTemplate;

    static getSiteContext(): SiteState {
        return getContext<SiteState>('sitestate');
    }

    constructor(dbCtx: DatabaseClient) {
        this.#dbCtx = dbCtx;
    }

    async save(): Promise<PostgrestSingleResponse<any[]> | null> {
        if (this.saveStatus === 'SAVING') return null;

        this.saveStatus = 'SAVING';
        if (this.character) {
            const resp = await this.#dbCtx.saveCharacter(this.character);
            this.saveStatus = !!resp ? 'SUCCEEDED' : 'FAILED';
            return resp;
        }

        if (this.campaign) {
            const resp = await this.#dbCtx.saveCampaign(this.campaign);
            this.saveStatus = !!resp ? 'SUCCEEDED' : 'FAILED';
            return resp;
        }

        console.trace('trying to save with no data', this);
        return null;
    }

    async pullCharacter(name: string): Promise<CharacterDataRow | null> {
        const character = await this.#dbCtx.getCharacterByName(name);

        this.character = character;
        this.#originalTheme = this.character?.theme ?? ThemeTemplate;
        return this.character;
    }

    async pullCampaign(id: string): Promise<CampaignDataRow | null> {
        const campaign = await this.#dbCtx.getCampaignById(id);

        this.campaign = campaign;
        this.#originalTheme = this.campaign?.theme ?? ThemeTemplate;
        return this.campaign;
    }

    resetTheme() {
        if (this.character) {
            this.character.theme = this.#originalTheme;
            return;
        }

        if (this.campaign) {
            this.campaign.theme = this.#originalTheme;
        }
    }
}

export class DatabaseClient {
    user: User | null = $state(null);
    session: Session | null = $state(null);

    #db: SupabaseClient;

    static getDatabaseContext(): DatabaseClient {
        return getContext<DatabaseClient>('database');
    }

    constructor(db: SupabaseClient) {
        this.#db = db;
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
        if (!this.user) {
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

    async saveCharacter(character: CharacterDataRow): Promise<PostgrestSingleResponse<any[]> | null> {
        if (!this.user) {
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

    async saveCampaign(campaign: CampaignDataRow): Promise<PostgrestSingleResponse<any[]> | null> {
        if (!this.user) {
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
}
