/**
 * Thomas theme for WebHemi
 *
 * @copyright 2012 - 2017 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

if (typeof formOptions === 'undefined') {
    var formOptions = {
        verbose: ThomasOptions.verbose
    };
}

/**
 * Form component.
 *
 * @type {{init}}
 */
var Form = function (options)
{
    "use strict";

    /** @type {boolean} */
    var initialized = false;
    /** @type {NodeList} */
    var formElements = [];
    /** @type {number} */
    var idCounter = 1;

    /**
     * Adds special functionality to
     * @param HTMLElement
     * @return {{constructor: FormElement, onBeforeSubmit: onBeforeSubmit, onSuccess: onSuccess, onFailure: onFailure}}
     * @constructor
     */
    var FormElement = function(HTMLElement)
    {
        var isAjaxForm = HTMLElement.classList.contains('ajax');
        var targetUrl = HTMLElement.getAttribute('action');
        var onBeforeSubmitCallback;
        var onSuccessCallback;
        var onFailureCallback;

        /**
         * Handles the form submit event.
         *
         * @param {Event} event
         * @return {boolean}
         */
        var submitForm = function(event)
        {

            if (typeof onBeforeSubmitCallback !== 'undefined') {
                var returnValue = onBeforeSubmitCallback(event);

                if (returnValue === false) {
                    return false;
                }
            }

            if (isAjaxForm) {
                event.preventDefault();

                var formData = new FormData(HTMLElement);

                Util.ajax({
                    url: targetUrl,
                    data: formData,
                    success: onSuccessCallback,
                    failure: onFailureCallback
                });
            }

            options.verbose && console.info(
                '%c⚡%c an Form element was submitted. %o',
                'color:orange;font-weight:bold',
                'color:#599bd6',
                '#'+HTMLElement.getAttribute('id')
            );
        };

        // Fix
        if (targetUrl === '') {
            targetUrl = location.href;
        }

        if (targetUrl.slice(-1) !== '/') {
            targetUrl = targetUrl + '/';
        }

        HTMLElement.setAttribute('action', targetUrl);

        Util.addEventListeners([HTMLElement], 'submit', submitForm, this);

        options.verbose && console.info(
            '%c✚%c a'+(isAjaxForm ? 'n Ajax' : '')+' Form element is initialized %o',
            'color:green; font-weight:bold;',
            'color:black;',
            '#'+HTMLElement.getAttribute('id')
        );

        return {
            constructor : FormElement,

            /**
             * Waiting for a callback function. Fires right before the submit.
             *
             * @param {function} callback
             */
            onBeforeSubmit : function(callback)
            {
                if (typeof callback === 'function') {
                    onBeforeSubmitCallback = callback;
                }
            },

            /**
             * Waiting for a callback function. Fires only for AjaxForms when the reponse is a success.
             *
             * @param {function} callback
             */
            onSuccess: function(callback)
            {
                if (typeof callback === 'function') {
                    onSuccessCallback = callback;
                }
            },

            /**
             * Waiting for a callback function. Fires only for AjaxForms when the reponse is a failure.
             *
             * @param {function} callback
             */
            onFailure: function(callback)
            {
                if (typeof callback === 'function') {
                    onFailureCallback = callback;
                }
            }
        }
    };

    if (typeof Util === 'undefined') {
        throw new ReferenceError('The Util component is required to use this component.');
    }

    options.verbose && console.info(
        '%c✔%c the Form component is loaded.',
        'color:green; font-weight:bold;',
        'color:black; font-weight:bold;'
    );

    return {
        /**
         * Initializes the loader and collects the elements.
         */
        init : function()
        {
            if (initialized) {
                return;
            }

            options.verbose && console.group(
                '%c  looking for Form Elements...',
                'color:#cecece'
            );

            formElements = document.querySelectorAll('form');

            for (var i = 0, len = formElements.length; i < len; i++) {
                if (!formElements[i].hasAttribute('id')) {
                    formElements[i].setAttribute('id', 'form' + (idCounter++));
                }

                formElements[i].component = new FormElement(formElements[i]);
            }

            options.verbose && console.groupEnd();

            Util.triggerEvent(document, 'FormComponentLoaded');
            initialized = true;
        }
    };
}(formOptions);

//     /**
//      * Submit event handler
//      *
//      * @param {Event} event
//      * @private
//      */
//     function ajaxSubmit(event) {
//         event.preventDefault();
//
//         var targetUrl = this.HTMLForm.getAttribute('action');
//
//         if ('' === targetUrl) {
//             targetUrl = location.href;
//         }
//         var formData = new FormData(this.HTMLForm);
//         var handler = this;
//
//         if (!handler.onBeforeSubmit(event)) {
//             return false;
//         }
//
//         Util.ajax({
//             url: targetUrl,
//             data: formData,
//             success: handler.onSuccess,
//             failure: handler.onFailure
//         });
//
//     }
//
//     /**
//      * Set event handler for the HTML element
//      */
//     function init()
//     {
//         this.HTMLForm.addEventListener('submit', ajaxSubmit.bind(this), true);
//         console.info('    + an Ajax Form is initialized (#'+this.HTMLForm.getAttribute('id')+')');
//     }
//
//     return {
//         /**
//          * Constructor
//          */
//         constructor:AjaxForm,
//
//
//         /**
//          * Private method caller
//          * @param {Function} callback
//          * @returns {Function}
//          * @private
//          */
//         _:function(callback){
//
//             // instance referer
//             var self = this;
//
//             // callback that will be used
//             return function(){
//                 return callback.apply(self, arguments);
//             };
//         },
//         init: function() { return this._(init)(); },
//         getTarget: function() { return this._(getTarget)(); }
//     };
// })();
