/**
 * WebHemi
 *
 * @copyright 2012 - 2017 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

var BackgroundImageLoader = {
    /** @var Boolean initialized  TRUE if the component is initialized */
    initialized : false,

    /**
     * Initialize Component
     */
    init : function()
    {
        this.initialized = true;
        console.info('  + Background Image Loader component loaded.');

        this.initLazyLoadBackgroundImages();
    },

    /**
     * Collect and initialize Elements
     */
    initLazyLoadBackgroundImages : function()
    {
        var lazyLoadBackgroundImages = document.querySelectorAll('*[data-background-src]');

        for (var i = 0, len = lazyLoadBackgroundImages.length; i < len; i++) {
            var imageHandler = new LazyLoadBackgroundImage(lazyLoadBackgroundImages[i]);
            imageHandler.init();
        }
    }
};

/**
 * Lazy Load Image handler class.
 *
 * @param HTMLElement
 * @constructor
 */
function LazyLoadBackgroundImage(HTMLElement) {
    /** @var HTMLElement */
    this.HTMLElement = HTMLElement;
    /** @var Boolean */
    this.loaded = false;
}

LazyLoadBackgroundImage.prototype = (function() {
    /**
     * Retrive the HTML element
     *
     * @returns {HTMLElement}
     */
    function getTarget() {
        return this.HTMLElement;
    }

    /**
     * Checks if the image is in the viewPort
     *
     * @returns {boolean}
     */
    function isElementInViewport() {
        var rect = this.HTMLElement.getBoundingClientRect()

        return (
            rect.top >= 0
            && rect.left   >= 0
            && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    /**
     * Load background image
     * @param event
     */
    function loadBackgroundImage(event) {
        if (this.loaded) {
            return;
        }

        if (this.isElementInViewport()) {
            var src = this.HTMLElement.getAttribute('data-background-src');
            var preload = new Image;
            var imageLoader = this;

            preload.onerror = function() {
                console.warn('Background Image ' + src + ' cannot be loaded.');
            };

            preload.onload = function() {
                imageLoader.HTMLElement.style.backgroundImage = "url(" + src + ")";
                imageLoader.HTMLElement.removeAttribute('data-background-src');
                imageLoader.loaded = true;
                console.info('      + a Lazy Load Background Image is loaded');
            };

            try {
                preload.src = src;
            } catch (exp) {}
        }
    }

    /**
     * Set event handler for the HTML element
     */
    function init()
    {
        window.addEventListener('scroll', loadBackgroundImage.bind(this), true);
        console.info('    + a Lazy Load Background Image is initialized');
        this.loadBackgroundImage();
    }

    return {
        /**
         * Constructor
         */
        constructor:LazyLoadBackgroundImage,

        /**
         * Private method caller
         * @param {requestCallback} callback
         * @returns {Function}
         * @private
         */
        _:function(callback){

            // instance referer
            var self = this;

            // callback that will be used
            return function(){
                return callback.apply(self, arguments);
            };
        },
        init: function() { return this._(init)(); },
        getTarget: function() { return this._(getTarget)(); },
        isElementInViewport: function() { return this._(isElementInViewport)(); },
        loadBackgroundImage: function() { return this._(loadBackgroundImage)(); }
    };
})();
