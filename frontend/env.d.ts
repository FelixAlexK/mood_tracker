/// <reference types="vite/client" />

declare module "bun" {
    type Env = {
      DATABASE_URL: string;
      KINDE_ISSUER_URL: string;
      KINDE_CLIENT_ID: string;
      KINDE_CLIENT_SECRET: string;
      KINDE_SITE_URL: string;
      KINDE_LOGOUT_REDIRECT_URI: string;
      KINDE_REDIRECT_URI: string;
      KINDE_DOMAIN: string;

    };
}
