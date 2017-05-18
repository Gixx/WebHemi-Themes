/**
 * Thomas theme for WebHemi
 *
 * @copyright 2012 - 2017 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

var SwipePager = {
    /* @var Boolean devugMode */
    debugMode: false,
    /* @var Array logType */
    logType: ['info', 'log', 'warn', 'error'],
    /* @var Number transition */
    transition: 200,
    /* @var Boolean initialized  TRUE if the component is initialized */
    initialized : false,
    /* @var HTMLElement container */
    container: null,
    /* @var Number scrollBy */
    scrollBy: 0,
    /* @var Number currentScrollPosition */
    currentScrollPosition: 0,
    /* @var Number maxScrollPosition */
    maxScrollPosition: 0,
    /* @var Mixed wheelTimer */
    wheelTimer: null,
    /* @var Boolean inDrag */
    inDrag: false,
    /* @var Boolean inScroll */
    inWheelSpin: false,
    /* @var Boolean inWheelSpin */
    inScroll: false,
    /* @var Number dragStart */
    dragStart: 0,

    /**
     * Initialize Component.
     */
    init : function ()
    {
        if (typeof Util === 'undefined') {
            throw new ReferenceError('The Util component is required to use this component.');
        }

        try {

            this.container = document.getElementById('swipe-pager');
            var pages = document.querySelectorAll('#swipe-pager > article');
            var navigationButtons = document.querySelectorAll('.mdl-grid-x div.pager');

            this.scrollBy = Math.floor(this.container.offsetWidth / pages.length);
            this.maxScrollPosition = this.container.offsetWidth - this.scrollBy;

            Util.addEventListener(document, 'keydown', this.handleKey, this);
            Util.addEventListener(navigationButtons, 'click', this.handleButton, this);
            Util.addEventListener(document, 'wheel', this.handleWheel, this);
            Util.addEventListener(document, 'touchstart touchmove touchend', this.handleTouch, this);
            Util.addEventListener(document, 'mousedown mousemove mouseup selectstart', this.handleDrag, this);

            setInterval(this.fixScroll.bind(this), 400);

            this.initialized = true;
            console.info('  + SwipePager component loaded.');

            if (this.debugMode) {
                this.log('info', '    - Debug mode on.');
            }
        } catch (exp) {
            this.log('log', exp);
        }
    },

    /**
     * Log into console when it is allowed.
     *
     * @param mode
     */
    log: function(mode)
    {
        if (this.debugMode) {
            if (!Util.inArray(mode, this.logType)) {
                mode = 'log';
            }
            console[mode].apply(null, Array.prototype.slice.call(arguments, 1));
        }
    },

    /**
     * Fixes scroll position
     */
    fixScroll: function()
    {
        if (!this.inScroll && !this.inDrag && !this.inWheelSpin) {
            var pages = document.querySelectorAll('#swipe-pager > article');
            var testScrollBy = Math.floor(this.container.offsetWidth / pages.length);

            if (testScrollBy !== this.scrollBy) {
                this.log('info', '      * Fix scroll after resize');
                var multiplier = Math.floor(this.currentScrollPosition / this.scrollBy);
                this.scrollBy = testScrollBy;
                this.maxScrollPosition = this.container.offsetWidth - this.scrollBy;
                this.scrollPageTo(multiplier * this.scrollBy);
                return true;
            }

            if (this.container.parentNode.scrollLeft !== this.currentScrollPosition) {
                this.log('info', '      * Fix scroll position of ', this.container.parentNode.scrollLeft, 'vs.', this.currentScrollPosition);
                this.scrollPageTo(this.container.parentNode.scrollLeft, true);
                return true;
            }
        }
    },

    /**
     * Handles button navigation.
     *
     * @param event
     */
    handleButton: function (event)
    {
        event.preventDefault();
        if (!this.inScroll) {
            var scrollTo = this.currentScrollPosition;

            if (this.currentScrollPosition > 0
                && event.srcElement.innerHTML.lastIndexOf('navigate_before') >= 0
            ) {
                scrollTo -= this.scrollBy;
                this.log('info', '      * Button: left | current pos.:', this.currentScrollPosition, ' | scroll to: ', scrollTo);
            } else if (this.currentScrollPosition < this.maxScrollPosition
                && event.srcElement.innerHTML.lastIndexOf('navigate_next') >= 0
            ) {
                scrollTo += this.scrollBy;
                this.log('info', '      * Button: right | current pos.:', this.currentScrollPosition, ' | scroll to: ', scrollTo);
            }
            this.scrollPageTo(scrollTo, true);
        }
    },

    /**
     * Handles keyboard navigation.
     *
     * @param event
     */
    handleKey: function (event)
    {
        if (!this.inScroll) {
            var scrollTo = this.currentScrollPosition;

            if (this.currentScrollPosition > 0 && event.key === 'ArrowLeft') {
                scrollTo -= this.scrollBy;
                this.log('info', '      * Key: left | current pos.:', this.currentScrollPosition, ' | scroll to: ', scrollTo);
            } else if (this.currentScrollPosition < this.maxScrollPosition && event.key === 'ArrowRight') {
                scrollTo += this.scrollBy;
                this.log('info', '      * Key: right | current pos.:', this.currentScrollPosition, ' | scroll to: ', scrollTo);
            }
            this.scrollPageTo(scrollTo, true);
        }
    },

    /**
     * Handles mousewheel scroll as well as touchpad scroll.
     *
     * @param event
     */
    handleWheel: function (event)
    {
        this.inDrag = false;

        if (this.container.parentNode.scrollLeft <= 0) {
            event.preventDefault();
            this.container.parentNode.scrollLeft = 1;
            this.inWheelSpin = false;
            return false;
        }

        if (this.container.parentNode.scrollLeft >= this.maxScrollPosition) {
            event.preventDefault();
            this.container.parentNode.scrollLeft = this.maxScrollPosition - 1;
            this.inWheelSpin = false;
            return false;
        }

        if (!this.inScroll) {
            var deadZone = 5;

            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
                this.inWheelSpin = Math.abs(event.deltaX) > deadZone;
                this.log('info', '      * Wheel in use');
            }
        } else {
            this.inWheelSpin = false;
            event.preventDefault();
            return false;
        }
    },

    /**
     * Handles mouse drag event.
     *
     * @param event
     */
    handleDrag: function (event)
    {
        if (!this.inScroll) {
            if (event.type === 'selectstart') {
                event.preventDefault();
            } else {
                if (event.type === 'mousedown' && this.isEventInContainer(event)) {
                    this.log('info', '      * Drag start');
                    this.inDrag = true;
                    this.inWheelSpin = false;
                    this.dragStart = event.clientX;
                }

                if (event.type === 'mouseup' && event.srcElement.innerHTML.lastIndexOf('navigate_') == -1) {
                    this.log('info', '      * Drag end');
                    this.inDrag = false;
                    this.scrollPageTo(this.container.parentNode.scrollLeft, true);
                }

                if (event.type === 'mousemove' && this.inDrag && !this.inWheelSpin) {
                    this.log('info', '      * Dragging...');
                    this.container.parentNode.scrollLeft = this.currentScrollPosition + (this.dragStart - event.clientX);
                }
            }
        }
    },

    /**
     * Handles touch screen event.
     *
     * @param event
     */
    handleTouch: function (event)
    {
        if (event.type === 'touchstart') {
            this.log('info', '      * Touch start');
            this.inDrag = true;
        }

        if (event.type === 'touchend') {
            this.log('info', '      * Touch end');
            this.inDrag = false;
        }
    },

    /**
     * Checks if the event is triggered in the container.
     *
     * @param event
     * @returns {boolean}
     */
    isEventInContainer: function (event)
    {
        for (var i in event.path) {
            if (typeof event.path[i].isEqualNode !== 'undefined' && event.path[i].isEqualNode(this.container)) {
                return true;
            }
        }

        return false;
    },

    /**
     * Scrolls the container to the new position.
     * @param position
     */
    scrollPageTo: function (position)
    {
        var smoothScroll = typeof arguments[1] !== 'undefined' ? arguments[1] : false;
        position = parseInt(Math.round(position / this.scrollBy) * this.scrollBy);

        if (position < 0) {
            position = 0;
        } else if (position > this.maxScrollPosition) {
            position = this.maxScrollPosition;
        }

        if (this.container.parentNode.scrollLeft !== position) {
            this.currentScrollPosition = position;

            if (smoothScroll && !SwipePager.inScroll) {
                this.log('warn', '      ! Smooth scroll to: ' + this.currentScrollPosition);
                this.inScroll = true;
                this.log('info', '        + Smooth scroll start');
                this.smoothScrollTo(this.currentScrollPosition, this.transition)
                    .then(function () {
                        // scroll ends
                        if (SwipePager.inScroll) {
                            SwipePager.log('info', '        + Smooth scroll end');
                            SwipePager.inScroll = false;
                        }
                    })
                    .catch(function(exp) {
                        // no issue, good to go, scroll ends
                        if (SwipePager.inScroll) {
                            SwipePager.log('info', '        + Smooth scroll end (abort)');
                            SwipePager.log('error', '        [!]', exp);
                            // SwipePager.inScroll = false;
                        }
                    });
            } else {
                this.log('warn', '      ! Instant scroll to: ' + this.currentScrollPosition);
                this.container.parentNode.scrollLeft = this.currentScrollPosition;
            }
        }
    },

    /**
     * Performs a smooth scroll to position.
     *
     * @param position
     * @param duration
     * @returns {*}
     */
    smoothScrollTo: function(position, duration) {
        var element = this.container.parentNode;
        var target = Math.round(position);
        duration = Math.round(duration);

        if (duration < 0) {
            return Promise.reject("bad duration");
        }

        if (duration === 0) {
            element.scrollLeft = target;
            return Promise.resolve();
        }

        var startTime = Date.now();
        var endTime = startTime + duration;
        var startPosition = element.scrollLeft;
        var distance = target - startPosition;

        // based on http://en.wikipedia.org/wiki/Smoothstep
        var smoothStep = function(start, end, point) {
            if(point <= start) { return 0; }
            if(point >= end) { return 1; }
            var x = (point - start) / (end - start);
            return x*x*(3 - 2*x);
        };

        return new Promise(function(resolve, reject) {
            var lastPosition = element.scrollLeft;
            var scrollFrame = function () {
                var now = Date.now();
                var point = smoothStep(startTime, endTime, now);
                var frameLeft = Math.round(startPosition + (distance * point));
                element.scrollLeft = frameLeft;

                if (now >= endTime) {
                    resolve();
                    return;
                }

                if (element.scrollLeft === lastPosition && element.scrollLeft !== frameLeft) {
                    resolve();
                    return;
                }
                lastPosition = element.scrollLeft;
                setTimeout(scrollFrame, 0);
            };

            setTimeout(scrollFrame, 0);
        });
    }
};
