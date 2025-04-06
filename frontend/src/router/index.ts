import type { RouteRecordRaw } from "vue-router";

import { userQueryOptions } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { QueryClient } from "@tanstack/vue-query";
import { createRouter, createWebHistory } from "vue-router";

const queryClient = new QueryClient();

export const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("../views/home-view.vue"), name: "Mood Tracker" },
  { path: "/moods", component: () => import("../views/all-moods-view.vue") },
  { path: "/mood/:id", component: () => import("../views/mood-detail-view.vue"), name: "", props: true },
  { path: "/stats", component: () => import("../views/stats-view.vue"), name: "Stats" },
  { path: "/about", component: () => import("../views/about-view.vue"), name: "About" },
  { path: "/profile", component: () => import("../views/profile.view.vue"), name: "Profile" },
  { path: "/auth", component: () => import("../views/auth-view.vue"), name: "Auth" },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0, behavior: "instant" };
  },
});

router.beforeEach(async (_to, _from) => {
  let user = queryClient.getQueryData(userQueryOptions.queryKey);
  const authStore = useAuthStore();

  try {
    user = await queryClient.fetchQuery(
      userQueryOptions,
    );
  }
  catch {
    user = undefined;
  }

  if (user) {
    authStore.setLoggedIn(true);
  }
  else {
    authStore.setLoggedIn(false);
  }
});

export default router;
