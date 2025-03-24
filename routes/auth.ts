
import {
    Hono
} from "hono";

import { kindeClient, sessionManager, getUser } from '../kinde'


export const authRoute = new Hono()

authRoute.get("/login", async (context) => {
    const loginUrl = await kindeClient.login(sessionManager(context));
    return context.redirect(loginUrl.toString());
});

authRoute.get("/register", async (context) => {
    const registerUrl = await kindeClient.register(sessionManager(context));
    return context.redirect(registerUrl.toString());
});

authRoute.get("/callback", async (context) => {
    //get called every time the user login or register
    const url = new URL(context.req.url);
    await kindeClient.handleRedirectToApp(sessionManager(context), url);
    return context.redirect("/");
});

authRoute.get("/logout", async (context) => {
    const logoutUrl = await kindeClient.logout(sessionManager(context));
    return context.redirect(logoutUrl.toString());
});

authRoute.get("/me", getUser, async (context) => {
   const user = context.var.user;
    return context.json({ user });
});