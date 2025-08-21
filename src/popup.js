/* eslint-disable no-undef */
const getCurrentTab = async () => {
	const queryOptions = {
		active: true,
		lastFocusedWindow: true
	};

	const [tab] = await chrome.tabs.query(queryOptions);

	return tab;
};

/**
 * @param {number} port
 */
const go = async (port = 3000) => {
	const tab = await getCurrentTab();

	if (tab?.url && tab?.url.startsWith('http')) {
		const url = new URL(tab.url);
		if (url.host !== 'localhost') {
			const localhostUrl = url.href.replace(url.host, `localhost:${port}`);

			await chrome.tabs.create({
				active: true,
				url: localhostUrl
			});
		}
	}
};

// Constants
const STORAGE_KEY = 'x-last-port';

// Elements
const form = document.getElementById('js-form');
const input = document.getElementById('js-port');

// Get last used port value and set to input's value
const lastPort = localStorage.getItem(STORAGE_KEY);
if (lastPort) {
	input.value = lastPort;
}

// Bind event listeners
form.addEventListener('submit', (e) => {
	const port = e.target.port.value;

	go(port);

	localStorage.setItem(STORAGE_KEY, port);
});

// Set focus
input.focus();
input.select();
