/**
 * Thomas theme for WebHemi
 *
 * @copyright 2012 - 2017 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

// Start using the Web Hemi Components from here
document.addEventListener("ThomasComponentsLoaded", function(event) {
    if (typeof document.getElementById('login').component !== 'undefined') {
        var handler = document.getElementById('login').component;

        // Add progress indicator and set inputs inactive
        handler.onBeforeSubmit(function(event)
        {
            // add MDL progressbar
            if (typeof componentHandler !== 'undefined') {
                var submitButton = event.target.querySelector('button[type=submit]');
                var progressBar = document.createElement('div');
                progressBar.setAttribute('id','formSubmitProgress');
                progressBar.setAttribute('class', 'mdl-progress mdl-js-progress mdl-progress__indeterminate');
                submitButton.parentNode.insertBefore(progressBar, submitButton);

                // apply MDL on new elements
                componentHandler.upgradeDom();
            }

            // Disable elements
            document.getElementById('id_login_identification').setAttribute('readonly',true);
            document.getElementById('id_login_password').setAttribute('readonly',true);
            document.getElementById('id_login_submit').setAttribute('disabled',true);

            var errorElements = document.querySelectorAll('form div.error');
            if (errorElements.length > 0) {
                for (var i = 0, len = errorElements.length; i < len; i++) {
                    errorElements[i].parentNode.removeChild(errorElements[i]);
                }
            }

            return true;
        });

        // On error remove progress, set inputs active
        handler.onFailure(function()
        {
            var progress = document.getElementById('formSubmitProgress');
            if (progress) {
                progress.parentNode.removeChild(progress);
            }

            // Enable elements
            document.getElementById('id_login_identification').removeAttribute('readonly',true);
            document.getElementById('id_login_password').removeAttribute('readonly',true);
            document.getElementById('id_login_submit').removeAttribute('disabled',true);
        });

        // On response remove progress, set inputs active and handle the response
        handler.onSuccess(function(data)
        {
            data = JSON.parse(data);

            if (typeof DOMAIN === 'undefined') {
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
            document.getElementById('id_login_identification').removeAttribute('readonly',true);
            document.getElementById('id_login_password').removeAttribute('readonly',true);
            document.getElementById('id_login_submit').removeAttribute('disabled',true);

            if (typeof dataErrors.length !== 'undefined' && dataErrors.length === 0) {
                location.href = DOMAIN;
            } else {
                // remove all previous errors
                var errorElements = document.querySelectorAll('form div.error');

                if (errorElements.length > 0) {
                    for (i in errorElements) {
                        if (errorElements.hasOwnProperty(i)) {
                            errorElements[i].parentNode.removeChild(errorElements[i]);
                        }
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

                                if (errorBlock === null) {
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
                    for (i = 0, len = errorElements.length; i < len; i++) {
                        errorElements[i].classList.remove('hide');
                    }
                }
            }
        });

        // Remove error messages upon input events
        Util.addEventListeners(document.querySelectorAll('#loginForm input'), 'focus select change', function(){
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
