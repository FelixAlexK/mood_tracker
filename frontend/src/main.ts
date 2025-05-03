import "./styles.css";

import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import i18n from './i18n'



import App from "./app.vue";
import router from "./router";


const pinia = createPinia();
const app = createApp(App);

app.use(i18n);
app.use(pinia);
app.use(router);
app.use(VueQueryPlugin);
app.mount("#app");
