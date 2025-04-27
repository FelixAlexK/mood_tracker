import type { RouteRecordRaw } from "vue-router";

import { userQueryOptions } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { QueryClient } from "@tanstack/vue-query";
import { createRouter, createWebHistory } from "vue-router";

const queryClient = new QueryClient();

export const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("../views/home-view.vue"), name: "Mood Tracker", meta: { requiresAuth: true } },
  { path: "/moods", component: () => import("../views/overview-view.vue"), meta: { requiresAuth: true } },
  { path: "/mood/:id", component: () => import("../views/detail-view.vue"), name: "", props: true, meta: { requiresAuth: true } },
  { path: "/stats", component: () => import("../views/stats-view.vue"), name: "Stats", meta: { requiresAuth: true } },
  { path: "/about", component: () => import("../views/about-view.vue"), name: "About", meta: { requiresAuth: false } },
  { path: "/profile", component: () => import("../views/profile-view.vue"), name: "Profile", meta: { requiresAuth: true } },
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
  const authStore = useAuthStore();

  try {
    user = await queryClient.fetchQuery(
      userQueryOptions,
    );
  }
  catch {
    user = undefined;
  }

  if (to.meta.requiresAuth && user?.data) {
    authStore.setLoggedIn(true);
    authStore.setUser(user?.data);
  }
  else if (!user?.data || user?.error) {
    authStore.setLoggedIn(false);
    authStore.setUser(undefined);
  }
});

export default router;
