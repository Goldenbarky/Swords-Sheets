
import type { Session, User } from '@supabase/gotrue-js';
import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";

export class DatabaseConnection {
    user: User | null = $state(null);
    session: Session | null = $state(null);
    activeCharacterRow: CharacterDataRow | null = $state(null);
    activeCampaignRow: CampaignDataRow | null = $state(null);

    db: SupabaseClient;

    constructor(db: SupabaseClient) {
        this.db = db;
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
        if (!character || !!error) {
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
        if (!campaign || !!error) {
            console.error('failed to acquire campaign', id, error);
        }

        this.activeCampaignRow = campaign;
        return this.activeCampaignRow;
    }
}
