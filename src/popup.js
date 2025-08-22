/* eslint-disable no-use-before-define */
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
const go = async (port = 3000, newtab = true) => {
	messageContainer.innerText = '';
	const tab = await getCurrentTab();

	if (tab?.url && tab?.url.startsWith('http')) {
		const url = new URL(tab.url);

		if (url.hostname !== 'localhost' || url.port !== port) {
			const localhostUrl = url.href.replace(url.host, `localhost:${port}`);

			if (newtab) {
				chrome.tabs.create({
					active: true,
					openerTabId: tab.id,
					url: localhostUrl
				});

				return true;
			}

			chrome.tabs.update(tab.id, {
				url: localhostUrl
			});

			return true;
		}

		messageContainer.innerText = `Error: the URLs must be different.`;

		return false;
	}

	messageContainer.innerText = `Error: the URL must be HTTP protocol.`;

	return false;
};

// Constants
const STORAGE_KEY_PORT = 'x-last-port';
const STORAGE_KEY_NEWTAB = 'x-last-newtab';

// Elements
const form = document.getElementById('js-form');
const input = document.getElementById('js-port');
const checkbox = document.getElementById('js-newtab');
const messageContainer = document.getElementById('js-message-container');

// Get last used port value and set to input's value
const lastPort = localStorage.getItem(STORAGE_KEY_PORT);
if (lastPort) {
	input.value = lastPort;
}

// Get last used port value and set to input's value
const lastNewtab = localStorage.getItem(STORAGE_KEY_NEWTAB);
if (lastNewtab) {
	checkbox.checked = lastNewtab === '1';
}

// Bind event listeners
form.addEventListener('submit', (e) => {
	e.preventDefault();
	e.stopImmediatePropagation();

	const port = e.target.port.value;
	const newtab = e.target.newtab.checked;

	go(port, newtab);

	localStorage.setItem(STORAGE_KEY_PORT, port);
	localStorage.setItem(STORAGE_KEY_NEWTAB, newtab ? '1' : '0');
});

// Set focus
input.focus();
input.select();
