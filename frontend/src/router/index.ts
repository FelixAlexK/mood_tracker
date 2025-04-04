import type { RouteRecordRaw } from "vue-router";

import { createRouter, createWebHistory } from "vue-router";

export const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("../views/home-view.vue"), name: "Mood Tracker" },
  { path: "/my-moods", component: () => import("../views/my-moods.vue"), name: "My Moods" },
  { path: "/mood/:id", component: () => import("../views/mood-detail.vue"), name: "", props: true },
  { path: "/stats", component: () => import("../views/stats-view.vue"), name: "Stats" },
  { path: "/about", component: () => import("../views/about-view.vue"), name: "About" },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
