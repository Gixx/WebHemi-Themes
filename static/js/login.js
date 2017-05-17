/**
 * Thomas theme for WebHemi
 *
 * @copyright 2012 - 2017 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

var path = resourcePAth + '/img/login/';
var images = [
    '7-themes-com-7028725-green-foliage-branches.jpg',
    '7-themes-com-7033392-autumn-red-leaves.jpg',
    '7-themes-com-7038256-autumn-colors-leaves.jpg',
    '7-themes-com-7041505-tree-red-leaves.jpg',
    '7-themes-com-7041410-magnolia-flowers.jpg'
];
var cache = [];
var min = 0;
var max = images.length - 2;
var loadedIndex = Math.floor(Math.random()*(max - min + 1) + min);

function getBackgroundStyle(imageSrc)
{
    return "linear-gradient(to bottom, #000 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 70%,#000 100%), url('"+imageSrc+"') center center no-repeat";
}

// When the DOM is ready, we make some customization
document.addEventListener("DOMContentLoaded", function(event) {
    // Pre-loading the images after the page is rendered
    for (var i = 0; i < images.length; i++) {
        cache[i] = document.createElement('img');
        cache[i].src = path + images[i];
    }

    document.body.style.background = getBackgroundStyle(path + images[loadedIndex]);

    // create background switcher element with different image as the body's
    var switcher = document.createElement('div');
    switcher.setAttribute('id', 'switcher');
    document.body.appendChild(switcher);

    // create license element
    var license = document.createElement('div');
    license.setAttribute('id', 'license');
    license.innerHTML = 'Images: <a href="http://7-themes.com" target="_blank">7-themes.com</a>';
    document.body.appendChild(license);

    // get transition duration for the switcher
    var sleep = parseFloat(window.getComputedStyle(switcher).transitionDuration) * 1000;
    // set an interval of 10 second + animation time for a clear view of the background
    var interval = sleep + 10100;

    // start the background switcher loop
    setInterval(function() {
        // increment/reset background index
        if(++loadedIndex >= images.length) {
            loadedIndex = 0;
        }
        switcher.style.background = getBackgroundStyle(path + images[loadedIndex]);
        // run (CSS) transition
        switcher.classList.add('show');

        // wait for the css transition
        setTimeout(function(){
            // set the switcher's background for the body as well
            document.body.style.background = getBackgroundStyle(path + images[loadedIndex]);
            // "reset" the switcher
            switcher.classList.remove('show');
        }, sleep + 100);
    }, interval);
});

var errorMessageTimer = null;

// Start using the Web Hemi Components from here
document.addEventListener("ThomasComponentsLoaded", function(event) {
    var handler = Form.getAjaxFormHandler('login');

    if (typeof handler != 'undefined') {
        // Add progress indicator and set inputs inactive
        handler.onBeforeSubmit = function(event) {
            // add MDL progressbar
            if (typeof componentHandler != 'undefined') {
                var submitButton = event.target.querySelector('button[type=submit]');
                var progressBar = document.createElement('div');
                progressBar.setAttribute('id','formSubmitProgress');
                progressBar.setAttribute('class', 'mdl-progress mdl-js-progress mdl-progress__indeterminate');
                submitButton.parentNode.insertBefore(progressBar, submitButton);

                // apply MDL on new elements
                componentHandler.upgradeDom();
            }

            // Disable elements
            document.getElementById('id_login_identification').setAttribute('disabled',true);
            document.getElementById('id_login_password').setAttribute('disabled',true);
            document.getElementById('id_login_submit').setAttribute('disabled',true);

            var errorElements = document.querySelectorAll('form div.error');
            if (errorElements.length > 0) {
                for (var i = 0, len = errorElements.length; i < len; i++) {
                    errorElements[i].parentNode.removeChild(errorElements[i]);
                }
            }

            return true;
        };

        // On error remove progress, set inputs active
        handler.onFailure = function() {
            var progress = document.getElementById('formSubmitProgress');
            if (progress) {
                progress.parentNode.removeChild(progress);
            }

            // Enable elements
            document.getElementById('id_login_identification').removeAttribute('disabled',true);
            document.getElementById('id_login_password').removeAttribute('disabled',true);
            document.getElementById('id_login_submit').removeAttribute('disabled',true);
        };

        // On response remove progress, set inputs active and handle the response
        handler.onSuccess = function(data) {
            if (typeof DOMAIN == 'undefined') {
                var DOMAIN = location.href.replace(/\/auth\/login/, '');
            }

            if (DOMAIN.lastIndexOf('http') < 0) {
                DOMAIN = '//' + DOMAIN;
            }

            var formId = 'login';
            var i, j;
            var dataErrors = data.loginForm.errors;

            var progress = document.getElementById('formSubmitProgress');
            if (progress) {
                progress.parentNode.removeChild(progress);
            }

            // Enable elements
            document.getElementById('id_login_identification').removeAttribute('disabled',true);
            document.getElementById('id_login_password').removeAttribute('disabled',true);
            document.getElementById('id_login_submit').removeAttribute('disabled',true);

            if (typeof dataErrors.length != 'undefined' && dataErrors.length == 0) {
                location.href = DOMAIN;
            } else {
                // remove all previous errors
                var errorElements = document.querySelectorAll('form div.error');

                if (errorElements.length > 0) {
                    for (i in errorElements) {
                        errorElements[i].parentNode.removeChild(errorElements[i]);
                    }
                }

                // for all elements with errors
                for (i in dataErrors) {
                    // if we have form error
                    if (dataErrors.hasOwnProperty(i)) {
                        var elementId = i;
                        // for all form elements with errors
                        for (j in dataErrors[i]) {
                            if (dataErrors[i].hasOwnProperty(j)) {
                                var errorBlock = null;
                                var messages = dataErrors[i][j];

                                // check for element and remove if exists
                                var errorElement = document.querySelector('#' + formId + ' div.element.' + elementId + ' div.error');

                                if (errorElement) {
                                    errorElement.parentNode.removeChild(errorElement);
                                }

                                // create an empty error element
                                errorElement = document.createElement('div');
                                errorElement.classList.add('error');
                                errorElement.innerHTML = '<ul></ul>';

                                document.querySelector('#' + formId + ' div.element.' + elementId).appendChild(errorElement);

                                if (!errorElement.classList.contains('hide')) {
                                    errorElement.classList.add('hide');
                                }

                                if (errorBlock == null) {
                                    errorBlock = document.querySelector('#' + formId + ' div.element.' + elementId + ' div.error ul');
                                }

                                for (var k = 0; k < messages.length; k++) {
                                    var errorMessageElement = document.createElement('li');
                                    var errorMessage = document.createTextNode(messages[k]);
                                    errorMessageElement.appendChild(errorMessage);
                                    errorBlock.appendChild(errorMessageElement);
                                }
                            }
                        }
                    } else {
                        // it's not a form error, so redirect to index page to see
                        //location.href = DOMAIN;
                    }
                }

                // search for errors and show them
                errorElements = document.querySelectorAll('form div.error.hide');

                if (errorElements.length > 0) {
                    for (var i = 0, len = errorElements.length; i < len; i++) {
                        errorElements[i].classList.remove('hide');
                    }
                }
            }
        };

        // Remove error messages upon input events
        Util.addEventListener(document.querySelectorAll('#loginForm input'), 'focus select change', function(){
            var errorElements = document.querySelectorAll('form div.error');

            if (errorElements.length > 0) {
                for (var i = 0, len = errorElements.length; i < len; i++) {
                    errorElements[i].classList.add('hide');
                }

                errorMessageTimer = setTimeout(function() {
                    var removeElements = document.querySelectorAll('form div.error.hide');

                    for (var i = 0, len = removeElements.length; i < len; i++) {
                        removeElements[i].parentNode.removeChild(removeElements[i]);
                    }
                }, 1200);
            }
        });
    }
});
