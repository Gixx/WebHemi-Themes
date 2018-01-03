/**
 * Thomas theme for WebHemi
 *
 * @copyright 2012 - 2018 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

if (typeof dialogOptions === 'undefined') {
    var dialogOptions = {
        verbose: ThomasOptions.verbose
    };
}

/**
 * Dialog component.
 *
 * @type {{init}}
 */
var Dialog = function(options)
{
    "use strict";

    /** @type {boolean} */
    var initialized = false;
    /** @type {boolean} */
    var nativeSupport = true;
    /** @type {NodeList} */
    var dialogElements = [];
    /** @type {number} */
    var idCounter = 1;
    /** @type {string} */
    var dialogShieldId = 'dialog-shield';

    /**
     * Dialog element handler.
     *
     * @param HTMLElement
     * @return {{constructor: DialogElement, open: open, close: close}}
     * @constructor
     */
    var DialogElement = function(HTMLElement)
    {
        if (!nativeSupport) {
            dialogPolyfill.registerDialog(HTMLElement);
        }

        options.verbose && console.info(
            '%c✚%c a Dialog element is initialized %o',
            'color:green; font-weight:bold;',
            'color:black;',
            '#'+HTMLElement.getAttribute('id')
        );

        return {
            constructor: DialogElement,

            /**
             * Opens the dialog window.
             *
             * @return {DialogElement}
             */
            open : function()
            {
                HTMLElement.showModal();
                if (!nativeSupport) {
                    document.getElementById(dialogShieldId).style.display = 'block';
                }

                return this;
            },

            /**
             * Closes the dialog window.
             *
             * @return {DialogElement}
             */
            close : function()
            {
                HTMLElement.close();
                if (!nativeSupport) {
                    document.getElementById(dialogShieldId).style.display = 'none';
                }

                return this;
            }
        }
    };

    if (typeof Util === 'undefined') {
        throw new ReferenceError('The Util component is required to use this component.');
    }

    options.verbose && console.info(
        '%c✔%c the Dialog component is loaded.',
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
                '%c  looking for Dialog Elements...',
                'color:#cecece'
            );
            dialogElements = document.querySelectorAll('dialog');

            if (dialogElements.length > 0 && !dialogElements[0].showModal) {
                nativeSupport = false;
            }

            if (!nativeSupport && typeof dialogPolyfill === 'undefined') {
                throw new ReferenceError('Dialog polyfill is not supported. Please include the \'dialog-polyfill.js\' first.');
            }

            // If there's no native browser support and there's no full-size dialog shield defined, we create one.
            if (!nativeSupport) {
                var dialogShield = document.getElementById(dialogShieldId);

                if (!dialogShield) {
                    dialogShield = document.createElement('DIV');
                    dialogShield.setAttribute('id', dialogShieldId);
                    dialogShield.setAttribute(
                        'style',
                        'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.1);z-index:1000;display:none;');
                    document.body.appendChild(dialogShield);
                }
            }

            for (var i = 0, len = dialogElements.length; i < len; i++) {
                if (!dialogElements[i].hasAttribute('id')) {
                    dialogElements[i].setAttribute('id', 'dialog' + (idCounter++));
                }

                dialogElements[i].component = new DialogElement(dialogElements[i]);
            }

            options.verbose && console.groupEnd();

            Util.triggerEvent(document, 'DialogComponentLoaded');
            initialized = true;
        }
    };
}(dialogOptions);
