import type { SessionManager, UserType } from "@kinde-oss/kinde-typescript-sdk";
import type { Context } from "hono";

import { createKindeServerClient, GrantType } from "@kinde-oss/kinde-typescript-sdk";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

// Client for authorization code flow
export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_DOMAIN!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URI!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
});

export function sessionManager(c: Context): SessionManager {
  return {
    async getSessionItem(key: string) {
      const result = getCookie(c, key);
      return result;
    },
    async setSessionItem(key: string, value: unknown) {
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
      } as const;
      if (typeof value === "string") {
        setCookie(c, key, value, cookieOptions);
      }
      else {
        setCookie(c, key, JSON.stringify(value), cookieOptions);
      }
    },
    async removeSessionItem(key: string) {
      deleteCookie(c, key);
    },
    async destroySession() {
      ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
        deleteCookie(c, key);
      });
    },
  };
}

type Env = {
  Variables: {
    user: UserType;
  };
};

export const getUser = createMiddleware<Env>(async (context, next) => {
  try {
    const manager = sessionManager(context);
    const isAuthenticated = await kindeClient.isAuthenticated(manager); // Boolean: true or false

    if (!isAuthenticated) {
      return context.json({ error: "Unauthorized" }, 401);
    }

    const user = await kindeClient.getUserProfile(manager);
    context.set("user", user);
    await next();
  }
  catch (error) {
    console.error(error);
    return context.json({ error: "Unauthorized" }, 401);
  }
});
