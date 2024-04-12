// import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
// import { createServerClient } from '@supabase/ssr'
// import type { Handle } from '@sveltejs/kit'

// export const handle: Handle = async ({ event, resolve }) => {
//   event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
//     cookies: {
//       get: (key) => event.cookies.get(key),
//       /**
//        * Note: You have to add the `path` variable to the
//        * set and remove method due to sveltekit's cookie API
//        * requiring this to be set, setting the path to an empty string
//        * will replicate previous/standard behaviour (https://kit.svelte.dev/docs/types#public-types-cookies)
//        */
//       set: (key, value, options) => {
//         event.cookies.set(key, value, { ...options, path: '/' })
//       },
//       remove: (key, options) => {
//         event.cookies.delete(key, { ...options, path: '/' })
//       },
//     },
//   })

//   /**
//    * a little helper that is written for convenience so that instead
//    * of calling `const { data: { session } } = await supabase.auth.getSession()`
//    * you just call this `await getSession()`
//    */
//   event.locals.getSession = async () => {
//     const {
//       data: { session },
//     } = await event.locals.supabase.auth.getSession()
//     return session
//   }

//   return resolve(event, {
//     filterSerializedResponseHeaders(name) {
//       return name === 'content-range'
//     },
//   })
// }

// src/routes/hooks.server.ts
// SvelteKit v2
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.supabaseServerClient = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            get: (key) => event.cookies.get(key),
            set: (key, value, options) => {
                event.cookies.set(key, value, { ...options, path: '/' });
            },
            remove: (key, options) => {
                event.cookies.delete(key, { ...options, path: '/' });
            }
        }
    });

    const getSessionAndUser = async () => {
        const { data: user, error: err } = await event.locals.supabaseServerClient.auth.getUser();

        let session;
        if (err) {
            return { session, user: null };
        }
        else {
            session = (await event.locals.supabaseServerClient.auth.getSession()).data?.session;
        }

        return { session, user };
    };

    const { session, user } = await getSessionAndUser();

    event.locals.session = session;
    event.locals.user = user;

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range';
        }
    });
};