let options;

function showError() {
	const HIDE_TIMEOUT = 3000;
	
	if (chrome.runtime.lastError) {
		let errorElem = document.querySelector('.error');

		errorElem.textContent = chrome.runtime.lastError.message;
		errorElem.classList.remove('hidden');

		setTimeout(function () {	
			errorElem.textContent = '';
			errorElem.classList.add('hidden');
		}, HIDE_TIMEOUT);
	}
	return chrome.runtime.lastError;
}

function initialiseOptions() {
	const defaultOptions = {
		language: 'en',
		level: 'advice'
	}
	
	chrome.storage.sync.get(defaultOptions, result => {
		if (!showError()) {
			options = result;
			document.getElementById('language').value = options.language;
			document.getElementById('level').value = options.level;
		}
	});
}

function setOptions() {
	options.language = document.getElementById('language').value;
	options.level = document.getElementById('level').value;
	chrome.storage.sync.set(options, showError);
}

function removeStylesheet() {
	const code = `
		var stylesheet = document.getElementById("a11yCSS");
		if ( stylesheet ) { stylesheet.parentNode.removeChild(stylesheet) }
	`;
    chrome.tabs.executeScript({code: code}, showError);
}

function addStylesheet() {
	const file = `/a11y.css/a11y-${options.language}_${options.level}.css`;
	const code = `
		var stylesheet = document.createElement("link");
		stylesheet.rel = "stylesheet";
		stylesheet.href = chrome.extension.getURL("${file}");
		stylesheet.id = "a11yCSS";
		document.getElementsByTagName("head")[0].appendChild(stylesheet);
	`;
    chrome.tabs.executeScript({code: code}, showError);
}

initialiseOptions();

document.getElementById('trigger').addEventListener('click', function() {
	setOptions();
	removeStylesheet();
	addStylesheet();
})

document.getElementById('reset').addEventListener('click', function() {
	removeStylesheet();
})