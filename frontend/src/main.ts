import "./styles.css";

import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./app.vue";
import i18n from "./i18n";
import router from "./router";

const pinia = createPinia();
const app = createApp(App);

app.use(i18n);
app.use(pinia);
app.use(router);
app.use(VueQueryPlugin);
app.mount("#app");
