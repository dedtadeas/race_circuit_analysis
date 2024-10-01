import { defineStore } from "pinia";

export const useAppOptionStore = defineStore({
  id: "appOption",
  state: () => {
    return {
    	appMode: 'dark',
    	appThemeClass: '',
    	appCoverClass: '',
		appBoxedLayout: false,
		appHeaderHide: false,
		appHeaderSearchToggled: false,
		appSidebarToggled: true,
		appSidebarCollapsed: true,
		appSidebarMobileToggled: false,
		appSidebarMobileClosed: false,
		appSidebarHide: false,
		appContentFullHeight: true,
		appContentClass: '',
		appTopNav: false,
		appFooter: true,
		appFooterFixed: true,
		appThemePanelToggled: false,
		}
  }
});
