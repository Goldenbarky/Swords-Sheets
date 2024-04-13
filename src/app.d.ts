import type { Session, SupabaseClient } from "@supabase/supabase-js";

// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            supabase: SupabaseClient
            safeGetSession(): Promise<{ session: Session | null; user: User | null }>
        }
        interface PageData {
            session: Session | null
            user: User | null
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export { };