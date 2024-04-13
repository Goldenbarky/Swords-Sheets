// import type { LayoutServerLoad } from './$types';

// export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
//   return {
//     session: await getSession(),
//   }
// }

// src/routes/+layout.server.ts
import type { LayoutServerLoad } from "./$types";
export const load: LayoutServerLoad = async ({ url, locals: { supabase, safeGetSession } }) => {

    const { session, user } = await safeGetSession();

    return {
        session,
        user
    };
};