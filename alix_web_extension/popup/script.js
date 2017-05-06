let options = {};

const BROWSER = chrome || browser;
const BROWSER_STRING = chrome ? 'chrome' : 'browser';
const STORAGE = BROWSER.storage.sync || BROWSER.storage.local;


function showError() {
    const HIDE_TIMEOUT = 3000;

    if (BROWSER.runtime.lastError) {
        let errorElem = document.querySelector('.error');

        errorElem.textContent = BROWSER.runtime.lastError.message;
        errorElem.classList.remove('hidden');

        setTimeout(function () {
            errorElem.textContent = '';
            errorElem.classList.add('hidden');
        }, HIDE_TIMEOUT);
    }
    return BROWSER.runtime.lastError;
}


function initialiseOptions() {
    const defaultOptions = {
        language: 'en',
        level: 'advice'
    };

    STORAGE.get(defaultOptions, result => {
        if (!showError()) {
            options = result;
            document.getElementById('language').value = options.language || defaultOptions.language;
            document.getElementById('level').value = options.level || defaultOptions.level;
        }
    });
}

function setOptions() {
    options.language = document.getElementById('language').value;
    options.level = document.getElementById('level').value;
    STORAGE.set(options, showError);
}

function removeStylesheet() {
    const code = `
        var stylesheet = document.getElementById('a11yCSS');
        if ( stylesheet ) { stylesheet.parentNode.removeChild(stylesheet) }
    `;
    BROWSER.tabs.executeScript({code: code});
}

function addStylesheet() {
    const file = `/a11y.css/a11y-${options.language}_${options.level}.css`;
    const code = `
        var stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = ${BROWSER_STRING}.extension.getURL('${file}');
        stylesheet.id = 'a11yCSS';
        document.getElementsByTagName('head')[0].appendChild(stylesheet);
    `;
    console.log(code);
    BROWSER.tabs.executeScript({code: code});
}


initialiseOptions();

document.getElementById('trigger').addEventListener('click', function() {
    setOptions();
    removeStylesheet();
    addStylesheet();
});

document.getElementById('reset').addEventListener('click', function() {
    removeStylesheet();
});
