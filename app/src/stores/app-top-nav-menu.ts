import { defineStore } from "pinia";

export const useAppTopNavMenuStore = defineStore({
  id: "appTopNavMenu",
  state: () => {
    return [{
      'url': '/',
      'icon': 'bi bi-house-door',
      'text': 'Home'
    }]
  }
});