import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Default to dark theme, but check local storage if available
const initialTheme = browser ? window.localStorage.getItem('theme') ?? 'dark' : 'dark';

export const theme = writable<string>(initialTheme);

theme.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('theme', value);
		if (value === 'light') {
			document.documentElement.classList.add('light-theme');
		} else {
			document.documentElement.classList.remove('light-theme');
		}
	}
});
