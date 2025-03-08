import type { LayoutLoad } from "./$types";

import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import {
  createBrowserClient,
  createServerClient,
  isBrowser,
} from "@supabase/ssr";
import { DatabaseClient, SiteState } from "$lib/Database.svelte";

export const load: LayoutLoad = async ({ fetch, data }) => {

  let dbClient = new DatabaseClient(data.user, data.cookies, fetch);
  const session = await dbClient.getSession();

  let siteState = new SiteState(dbClient);
  return {
    session: session,
    user: data.user,
    dbClient,
    siteState,
    spells: data.spells,
  };
};
