
import { browser } from '$app/environment';
import { PUBLIC_SITE_URL } from '$env/static/public';
import type { Session, User } from '@supabase/gotrue-js';
import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { getContext } from 'svelte';

export class DatabaseConnection {
    user: User | null = $state(null);
    session: Session | null = $state(null);
    activeCharacterRow: CharacterDataRow | null = $state(null);
    activeCampaignRow: CampaignDataRow | null = $state(null);

    db: SupabaseClient;

    static getDatabaseContext(): DatabaseConnection {
        return getContext<DatabaseConnection>('database');
    }

    constructor(db: SupabaseClient) {
        this.db = db;
    }

    async getCampaign(id: string): Promise<CampaignDataRow | null> {
        const { data: campaign, error } = await this.db
            .from("campaigns")
            .select("*")
            .eq("id", id)
            .single<CampaignDataRow>();
    
        if (!campaign || !!error) {
            console.error('failed to get campaign', id, error);
        }

        return campaign;
    }

    async getInvitesForCharacter(character_id: string): Promise<CampaignDataRow[] | null> {
        if (!this.user) {
            console.error('unable to get invites for character without user', this);
            return null;
        }

        const { data:campaign_ids, error: e1 } = await this.db
            .from("campaign_invites")
            .select("campaign_id")
            .eq("character_invited", character_id);

        if (!campaign_ids || !!e1) {
            console.error('failed to get campaign ids for character', character_id, e1);
            return null;
        }
        
        const { data:campaigns, error: e2 } = await this.db
            .from("campaigns")
            .select("*")
            .in("id", campaign_ids.map(x => x.campaign_id));
            
        if (!campaigns || !!e2) {
            console.error('failed to get campaign', character_id, e2);
        }
    
        return campaigns;
    }

    async getUsersCharacters(): Promise<CharacterDataRow[] | null> {
        const { data, error } = await this.db
            .from("characters")
            .select("*");

        if (!data || !!error) {
            console.error('failed to get users characters', data, error);
        }

        return data;
    }

    async save(): Promise<PostgrestSingleResponse<any[]> | undefined> {
        if (!this.user) {
            console.trace('unable to save without user', this);
            return;
        }

        if (this.activeCharacterRow) {
            const resp = await this.db
                .from("characters")
                .update(this.activeCharacterRow)
                .eq("id", this.activeCharacterRow.id)
                .select('*');
            return resp;
        }

        if (this.activeCampaignRow) {
            const resp = await this.db
                .from("campaigns")
                .update(this.activeCampaignRow)
                .eq("id", this.activeCampaignRow.id)
                .select('*');

            return resp;
        }

        console.trace('trying to save with no data', this);
        return;
    }

    async setGetCharacter(name: string): Promise<CharacterDataRow | null> {
        const { data: character, error } = await this.db
            .from("characters")
            .select("*")
            .eq("name", name)
            .single<CharacterDataRow>();
        if (browser && !character || !!error) {
            console.error('failed to acquire character', name, error);
        }

        this.activeCharacterRow = character;
        return this.activeCharacterRow;
    }

    async setGetCampaign(id: string): Promise<CampaignDataRow | null> {
        const { data: campaign, error } = await this.db
            .from("campaigns")
            .select("*")
            .eq("id", id)
            .single<CampaignDataRow>();
        if (browser && !campaign || !!error) {
            console.error('failed to acquire campaign', id, error);
        }

        this.activeCampaignRow = campaign;
        return this.activeCampaignRow;
    }

    async signInWithGoogle() {
        if (process.env.PW_TEST_USERNAME && process.env.PW_TEST_PASSWORD) {
            await this.db.auth.signInWithPassword({
                email: process.env.PW_TEST_USERNAME,
                password: process.env.PW_TEST_PASSWORD
            });
        } else {
            await this.db.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${PUBLIC_SITE_URL}${window.location.pathname.substring(1)}`,
                },
            });
        }
    }
}
