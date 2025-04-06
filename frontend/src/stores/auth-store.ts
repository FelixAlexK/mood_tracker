import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const isLoggedIn = ref(false);

  // Action to set the logged-in state
  const setLoggedIn = (status: boolean) => {
    isLoggedIn.value = status;
  };

  // Getter to retrieve the logged-in state
  const getLoggedIn = () => {
    return isLoggedIn.value;
  };

  return { isLoggedIn, setLoggedIn, getLoggedIn };
});
