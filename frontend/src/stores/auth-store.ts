import type { UserType } from "@/types";

import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const isLoggedIn = ref(false);
  const user = ref<UserType | undefined>(undefined);

  // Action to set the logged-in state
  const setLoggedIn = (status: boolean) => {
    isLoggedIn.value = status;
  };

  // Getter to retrieve the logged-in state
  const getLoggedIn = () => {
    return isLoggedIn.value;
  };

  const setUser = (userData: UserType | undefined) => {
    user.value = userData;
  };

  const getUser = () => {
    return user.value;
  };

  return { isLoggedIn, setLoggedIn, getLoggedIn, setUser, getUser, user };
});
