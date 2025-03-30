import type { RouteRecordRaw } from "vue-router";

import { createRouter, createWebHistory } from "vue-router";

export const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("../views/home-view.vue"), name: "Mood Tracker" },
  { path: "/about", component: () => import("../views/about-view.vue"), name: "About" },
  { path: "/create-mood", component: () => import("../views/create-view.vue"), name: "Create" },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
