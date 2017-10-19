/**
 * Thomas theme for WebHemi
 *
 * @copyright 2012 - 2017 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

if (typeof lazyLoadBackgroundImageOptions === 'undefined') {
    var lazyLoadBackgroundImageOptions = {
        verbose: ThomasOptions.verbose
    };
}

/**
 * LazyLoadBackgroundImage component.
 *
 * @type {{init}}
 */
var LazyLoadBackgroundImage = function(options)
{
    "use strict";

    /** @type {boolean} */
    var initialized = false;
    /** @type {NodeList} */
    var lazyLoadBackgroundImages = [];
    /** @type {number} */
    var idCounter = 1;

    /**
     * Adds lazy-load behaviour to an element's background image.
     *
     * @param HTMLElement
     * @return {{constructor: LazyLoadBackgroundImageElement}}
     * @constructor
     */
    var LazyLoadBackgroundImageElement = function(HTMLElement)
    {
        /** @type {boolean} */
        var loading = false;
        /** @type {boolean} */
        var loaded = false;

        /**
         * Checks if the image is in the viewPort
         *
         * @returns {boolean}
         */
        function isElementInViewport()
        {
            var rect = HTMLElement.getBoundingClientRect();

            return (
                rect.top >= 0
                && rect.left   >= 0
                && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
            );
        }

        /**
         * Load background image.
         */
        function loadBackgroundImage()
        {
            if (loaded || loading) {
                return;
            }

            if (isElementInViewport()) {
                loading = true;
                var src = HTMLElement.getAttribute('data-background-src');
                var preload = new Image;

                preload.onerror = function() {
                    options.verbose && console.info(
                        '%c✖%c the image ' + src + ' cannot be loaded.',
                        'color:red',
                        'color:black'
                    );
                    return true;
                };

                preload.onload = function() {
                    HTMLElement.style.backgroundImage = "url(" + src + ")";
                    HTMLElement.removeAttribute('data-background-src');
                    options.verbose && console.info(
                        '%c⚡%c a Lazy Load Background Image element is loaded %o',
                        'color:orange;font-weight:bold',
                        'color:#599bd6',
                        '#'+HTMLElement.getAttribute('id')
                    );
                };

                try {
                    preload.src = src;
                    loaded = true;
                } catch (exp) {
                    loading = false;
                }
            }
        }

        Util.addEventListeners([window], 'scroll', loadBackgroundImage, this);
        options.verbose && console.info(
            '%c✚%c a Lazy Load Background Image element is initialized %o',
            'color:green; font-weight:bold;',
            'color:black;',
            '#'+HTMLElement.getAttribute('id')
        );
        loadBackgroundImage();

        return {
            constructor: LazyLoadBackgroundImageElement
        };
    };

    if (typeof Util === 'undefined') {
        throw new ReferenceError('The Util component is required to use this component.');
    }

    options.verbose && console.info(
        '%c✔%c the Lazy Load Background Image component is loaded.',
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
                '%c  looking for Lazy Load Background Image Elements...',
                'color:#cecece'
            );
            lazyLoadBackgroundImages = document.querySelectorAll('*[data-background-src]');

            for (var i = 0, len = lazyLoadBackgroundImages.length; i < len; i++) {
                if (!lazyLoadBackgroundImages[i].hasAttribute('id')) {
                    lazyLoadBackgroundImages[i].setAttribute('id', 'lazyBackground' + (idCounter++));
                }

                lazyLoadBackgroundImages[i].component = new LazyLoadBackgroundImageElement(lazyLoadBackgroundImages[i]);
            }

            options.verbose && console.groupEnd();

            Util.triggerEvent(document, 'lazyLoadBackgroundImageComponentLoaded');
            initialized = true;
        }
    };
}(lazyLoadBackgroundImageOptions);
