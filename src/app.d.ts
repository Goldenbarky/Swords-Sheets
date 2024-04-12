import type { Session, SupabaseClient } from "@supabase/supabase-js";

// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            supabaseServerClient: SupabaseClient<Database>,
            session: Session | null | undefined,
            user: { user: User } | null
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};