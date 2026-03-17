import { writable, derived } from 'svelte/store';
import { translations } from './translations';

export const locale = writable('en');

if (typeof window !== 'undefined') {
	const storedLocale = localStorage.getItem('language');
	if (storedLocale && storedLocale in translations) {
		locale.set(storedLocale);
	}

	locale.subscribe((value) => {
		localStorage.setItem('language', value);
		document.documentElement.lang = value;
	});
}

export const t = derived(locale, ($locale) => {
	// @ts-ignore: dynamic dictionary access mapping
	return (key: string) => {
		// @ts-ignore
		return translations[$locale]?.[key] || key;
	};
});
