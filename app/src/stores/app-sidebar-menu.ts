import { defineStore } from "pinia";

export const useAppSidebarMenuStore = defineStore({
	id: "appSidebarMenu",
	state: () => {
		return [{
			'text': 'Navigation',
			'is_header': true
		},
		{
			'url': '/',
			'icon': 'bi bi-house-door',
			'text': 'Home'
		}
			,
		{
			'url': '/circuits',
			'icon': 'bi bi-map',
			'text': 'Circuits'
		}
		]
	}
});