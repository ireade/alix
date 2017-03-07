let options;

function initialiseOptions() {
	const defaultOptions = {
		language: 'en',
		level: 'advice'
	}
	options = localStorage.getItem('a11y_options') ? JSON.parse(localStorage.getItem('a11y_options')) : defaultOptions;
	document.getElementById('language').value = options.language;
	document.getElementById('level').value = options.level;
}

function setOptions() {
	options.language = document.getElementById('language').value;
	options.level = document.getElementById('level').value;
	localStorage.setItem('a11y_options', JSON.stringify(options));
}

function removeStylesheet() {
	const code = `
		var stylesheet = document.getElementById("a11yCSS");
		if ( stylesheet ) { stylesheet.parentNode.removeChild(stylesheet) }
	`;
    chrome.tabs.executeScript({code: code});
}

function addStylesheet() {
	const file = `/css/a11y-${options.language}_${options.level}.css`;
	const code = `
		var stylesheet = document.createElement("link");
		stylesheet.rel = "stylesheet";
		stylesheet.href = chrome.extension.getURL("${file}");
		stylesheet.id = "a11yCSS";
		document.getElementsByTagName("head")[0].appendChild(stylesheet);
	`;
    chrome.tabs.executeScript({code: code});
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