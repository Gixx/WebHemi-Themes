/**
 * Thomas theme for WebHemi
 *
 * @copyright 2012 - 2017 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

if (typeof backgroundImageRotatorOptions === 'undefined') {
    var backgroundImageRotatorOptions = {
        verbose: ThomasOptions.verbose
    };
}

/**
 * BackgroundImageRotator component.
 *
 * @type {{init}}
 */
var BackgroundImageRotator = function(options)
{
    "use strict";

    /** @type {boolean} */
    var initialized = false;
    /** @type {NodeList} */
    var rotatableBackgroundElements = [];
    /** @type {number} */
    var idCounter = 1;

    /**
     * Adds changeable background functionality to an element.
     *
     * @param HTMLElement
     * @return {{constructor: BackgroundImageRotatorElement, start: start, stop: stop}}
     * @constructor
     */
    var BackgroundImageRotatorElement = function(HTMLElement)
    {
        /** @type {number} */
        const MIN_DURATION = 400;
        /** @type {number} */
        const MAX_DURATION = 18000;

        /** @type {Array} */
        var cache = [];
        /** @type {number} */
        var rotateInterval = 5000;
        /** @type {number} */
        var transitionDuration = Math.round(rotateInterval / 4);
        /** @type {number} */
        var rotateIntervalTimer = null;
        /** @type {number} */
        var min;
        /** @type {number} */
        var max;
        /** @type {number} */
        var loadedIndex;
        /** @type HTMLElement */
        var switcher;
        /** @type {number} */
        var zIndex = 10;

        options.verbose && console.info(
            '%c➤%c a Rotatable Background Image element found... %o',
            'color:blue; font-weight:bold;',
            'color:black;',
            '#'+HTMLElement.getAttribute('id')
        );

        /**
         * Creates the switcher element for the seamless animation.
         */
        var createSwither = function () {
            var elementID = HTMLElement.getAttribute('id');
            var switcherCss = document.createElement('style');
            switcherCss.type = 'text/css';
            switcherCss.innerHTML = '' +
                '#'+elementID+' {\n' +
                '    background-size: cover !important;\n' +
                '}\n' +
                '#'+elementID+'Switcher {\n' +
                '    position: absolute;\n' +
                '    top: 0;\n' +
                '    left: 0;\n' +
                '    z-index: '+(zIndex+1)+';\n' +
                '    width: 100%;\n' +
                '    height: 100%;\n' +
                '    opacity: 0;\n' +
                '    transition: opacity '+transitionDuration+'ms;\n' +
                '    background-size: cover !important;\n' +
                '    background: linear-gradient(to bottom, #000 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 70%,#000 100%)\n' +
                '}\n' +
                '#'+elementID+'Switcher.show {\n ' +
                '    opacity: 1; \n' +
                '}';
            HTMLElement.appendChild(switcherCss);

            switcher = document.createElement('div');
            switcher.setAttribute('id', elementID+'Switcher');
            HTMLElement.appendChild(switcher);
        };

        /**
         * Preloads images
         */
        var preloadImages = function()
        {
            var basePath = '';

            if (HTMLElement.hasAttribute('data-background-set-source')) {
                basePath = HTMLElement.getAttribute('data-background-set-source');

                if (basePath.slice(-1) !== '/') {
                    basePath = basePath + '/';
                }
            }

            if (!HTMLElement.hasAttribute('data-background-set')) {
                throw new ReferenceError('No background images are defined.');
            }

            var images = HTMLElement.getAttribute('data-background-set').split(',');

            if (images.length === 1 && images[0] === '') {
                throw new ReferenceError('No background images are defined.');
            }

            options.verbose && console.group(
                '%c  preloading images...',
                'color:#cecece'
            );

            for (var i = 0; i < images.length; i++) {
                cache[i] = document.createElement('img');
                cache[i].src = basePath + images[i];
                options.verbose && console.info(
                    '%c⚡%c a background image is cached %c '+ basePath + images[i],
                    'color:orange; font-weight:bold;',
                    'color:black;',
                    'text-decoration:underline;font-style:italic'
                );
            }

            options.verbose && console.groupEnd();

            min = 0;
            max = Math.max(1, cache.length - 2);
            loadedIndex = Math.floor(Math.random()*(max - min + 1) + min);

            setBackground(HTMLElement, cache[loadedIndex].getAttribute('src'))
        };

        /**
         * Sets the background for the element.
         *
         * @param {HTMLElement} element
         * @param {string} imageSrc
         */
        var setBackground = function(element, imageSrc)
        {
            element.style.backgroundSize = 'cover !important';
            element.style.background = 'linear-gradient(to bottom, #000 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 70%,#000 100%), ' +
                'url('+imageSrc+') center center no-repeat';
        };

        /**
         * Sets the duration time.
         *
         * @param {number} transitionSpeed in ms.
         */
        var setTransitionSpeed = function(transitionSpeed)
        {
            transitionSpeed = Math.min(MAX_DURATION, Math.max(MIN_DURATION, transitionSpeed));

            rotateInterval = transitionSpeed;
            transitionDuration = Math.round(rotateInterval / 4);

            var elementID = HTMLElement.getAttribute('id');
            HTMLElement.querySelector('#'+elementID+'Switcher').style.transition = 'opacity '+transitionDuration+'ms';

            var extraInfo = '';

            if (transitionSpeed === MIN_DURATION) {
                extraInfo = ' (min)';
            } else if (transitionSpeed === MAX_DURATION) {
                extraInfo = ' (max)';
            }

            options.verbose && console.info(
                '%c⚡%c the background transition speed is set to '+rotateInterval+'ms.'+extraInfo,
                'color:orange; font-weight:bold;',
                'color:black;'
            );
        };

        /**
         * Determines the correct z-index.
         *
         * @param element
         */
        var setZIndex = function(element)
        {
            var els = [];
            while (element) {
                els.unshift(element);
                element = element.parentNode;
                zIndex++;
            }
            zIndex *= 5;
            HTMLElement.style.zIndex = zIndex;
        };

        try {
            setZIndex(HTMLElement);
            preloadImages();
            createSwither();

            if (HTMLElement.hasAttribute('data-background-set-speed')) {
                var transitionData = HTMLElement.getAttribute('data-background-set-speed');

                if (!isNaN(transitionData)) {
                    setTransitionSpeed(parseInt(transitionData));
                }
            }

            options.verbose && console.info(
                '%c✚%c a Rotatable Background Image element is initialized %o',
                'color:green; font-weight:bold;',
                'color:black;',
                '#'+HTMLElement.getAttribute('id')
            );
        } catch (error) {
            var errorMsg = error.toString().split("\n")[0];
            options.verbose && console.info(
                '%c✖%c Rotatable Background Image element (%o) has errors: %c'+ errorMsg,
                'color:red',
                'color:black',
                '#'+HTMLElement.getAttribute('id'),
                'text-decoration:underline;font-style:italic'
            );

            return {
                status : false
            };
        }

        return {
            constructor: BackgroundImageRotatorElement,

            /**
             * @type {boolean}
             */
            status : true,

            /**
             * Starts image rotation.
             */
            start : function()
            {
                rotateIntervalTimer = setInterval(function()
                {
                    // increment/reset background index
                    if(++loadedIndex >= cache.length) {
                        loadedIndex = 0;
                    }

                    setBackground(switcher, cache[loadedIndex].getAttribute('src'));
                    // run (CSS) transition
                    switcher.classList.add('show');

                    // wait for the css transition
                    setTimeout(function()
                    {
                        setBackground(HTMLElement, cache[loadedIndex].getAttribute('src'));
                        // "reset" the switcher
                        switcher.classList.remove('show');
                    }, Math.round(1.2 * transitionDuration));
                }, rotateInterval);
            },

            /**
             * Stops image rotation.
             */
            stop : function()
            {
                if (rotateIntervalTimer !== null) {
                    clearInterval(rotateIntervalTimer);
                    rotateIntervalTimer = null;
                }
            },

            /**
             * Change the transition speed im ms.
             *
             * @param {number} transitionSpeed
             */
            setTransitionSpeed : function(transitionSpeed)
            {
                if (!isNaN(transitionSpeed)) {
                    this.stop();
                    setTransitionSpeed(parseInt(transitionSpeed));
                    this.start();
                }
            }
        };
    };

    if (typeof Util === 'undefined') {
        throw new ReferenceError('The Util component is required to use this component.');
    }

    options.verbose && console.info(
        '%c✔%c the Background Image Rotator component is loaded.',
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
                '%c  looking for suitable Elements...',
                'color:#cecece'
            );

            rotatableBackgroundElements = document.querySelectorAll('*[data-background-set]');

            for (var i = 0, len = rotatableBackgroundElements.length; i < len; i++) {
                if (!rotatableBackgroundElements[i].hasAttribute('id')) {
                    rotatableBackgroundElements[i].setAttribute('id', 'rotatableBackground' + (idCounter++));
                }

                var imageRotateElement = new BackgroundImageRotatorElement(rotatableBackgroundElements[i]);

                if (imageRotateElement.status === true) {
                    rotatableBackgroundElements[i].component = imageRotateElement;
                    rotatableBackgroundElements[i].component.start();
                }
            }

            options.verbose && console.groupEnd();

            Util.triggerEvent(document, 'BackgroundImageRotatorComponentLoaded');
            initialized = true;
        }
    };
}(backgroundImageRotatorOptions);
