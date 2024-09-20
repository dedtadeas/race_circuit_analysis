import { defineStore } from "pinia";
import config from '@/config';

export const useAppOptionStore = defineStore({
	id: "appOption",
	state: () => {
		return {
			appMode: 'dark',
			appThemeClass: '',
			appCoverClass: '',
			appBoxedLayout: false,
			appHeaderHide: true, // HEADER HIDE
			appHeaderSearchToggled: false,
			appSidebarToggled: true,
			appSidebarCollapsed: true,
			appSidebarMobileToggled: false,
			appSidebarMobileClosed: false,
			appSidebarHide: false,
			appContentFullHeight: false,
			appContentClass: '',
			appTopNav: false,
			appFooter: false,
			appFooterFixed: true,
			appThemePanelToggled: true,

			// Custom
			testMode: config.testMode,
		}
	},
});
