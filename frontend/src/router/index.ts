import type { RouteRecordRaw } from "vue-router";

import { userQueryOptions } from "@/lib/api";
import { QueryClient } from "@tanstack/vue-query";
import { createRouter, createWebHistory } from "vue-router";

const queryClient = new QueryClient();

export const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("../views/home-view.vue"), name: "Mood Tracker" },
  { path: "/moods", component: () => import("../views/my-moods.vue"), name: "" },
  { path: "/mood/:id", component: () => import("../views/mood-detail.vue"), name: "", props: true },
  { path: "/stats", component: () => import("../views/stats-view.vue"), name: "Stats" },
  { path: "/about", component: () => import("../views/about-view.vue"), name: "About" },
  { path: "/profile", component: () => import("../views/profile.view.vue"), name: "Profile" },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0, behavior: "instant" };
  },
});

router.beforeEach(async (to, _from) => {
  let user = queryClient.getQueryData(userQueryOptions.queryKey);

  try {
    user = await queryClient.fetchQuery(
      userQueryOptions,
    );
  }
  catch {
    user = undefined;
  }

  if (
    !user && to.name !== "Login"
  ) {
    // redirect the user to the login page
    return { name: "Login" };
  }
});

export default router;
