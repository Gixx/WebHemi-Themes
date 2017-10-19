/**
 * Thomas theme for WebHemi
 *
 * @copyright 2012 - 2017 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

if (typeof progressDialogOptions === 'undefined') {
    var progressDialogOptions = {
        targetUrl: '/progress.php',
        dialogId: 'progressDialog',
        dialogInfo : {
            sessionIdAttribute : 'data-session',
            progressBarElementId : 'progress-bar',
            counterElementId : 'progress-counter',
            titleElementId : 'progress-title'
        },
        verbose: ThomasOptions.verbose
    };
}

/**
 * Progress Dialog component.
 *
 * @type {{init}}
 */
var ProgressDialog = function(options)
{
    "use strict";

    /** @type {boolean} */
    var initialized = false;
    /** @type {HTMLElement} */
    var progressDialogElement;
    /** @type {number} */
    var progressIntervalTime = 500;
    /** @type {number} */
    var progressIntervalId = null;

    /**
     * Progress Dialog element handler.
     *
     * @param HTMLElement
     * @return {{constructor: ProgressDialogElement, open: open, close: close, start: start, stop: stop, setTitle: setTitle, reset: reset}}
     * @constructor
     */
    var ProgressDialogElement = function(HTMLElement)
    {
        var DialogReference = HTMLElement.component;
        var progressId = HTMLElement.getAttribute(options.dialogInfo.sessionIdAttribute);
        var progressBar = HTMLElement.querySelector('#'+options.dialogInfo.progressBarElementId);
        var progressCounter = HTMLElement.querySelector('#'+options.dialogInfo.counterElementId);
        var progressTitle = HTMLElement.querySelector('#'+options.dialogInfo.titleElementId);

        function loadProgressData()
        {
            var jsonUrl = options.targetUrl+'?progress_id='+progressId;

            options.verbose && console.info('      -> HTTP GET: '+jsonUrl);

            Util.ajax({
                url: jsonUrl,
                method: 'GET',
                success: function(data) {
                    options.verbose && console.info('      <- Receive data...');

                    if (progressBar.classList.contains('mdl-progress__indeterminate')) {
                        progressBar.classList.remove('mdl-progress__indeterminate');
                    }

                    progressCounter.innerHTML = data.current + ' out of ' + data.total;
                    var counter = parseInt(Math.ceil(data.current / data.total * 100));
                    progressBar.MaterialProgress.setProgress(counter);
                }
            });
        }

        console.info(
            '%c✚%c the Progress Dialog component is attached to a Dialog element %o',
            'color:green; font-weight:bold;',
            'color:black;',
            '#'+HTMLElement.getAttribute('id')
        );

        return {
            constructor: ProgressDialogElement,

            /**
             * Opens the progress dialog window.
             *
             * @return {ProgressDialogElement}
             */
            open : function ()
            {
                this.reset();
                DialogReference.open();

                return this;
            },

            /**
             * Closes the progress dialog window.
             *
             * @return {ProgressDialogElement}
             */
            close : function ()
            {
                DialogReference.close();

                return this;
            },

            /**
             * Opens the progress dialog window and updates the counter.
             *
             * @return {ProgressDialogElement}
             */
            start : function()
            {
                this.open();
                progressIntervalId = setInterval((function() { loadProgressData(); }).bind(this), progressIntervalTime);

                return this;
            },

            /**
             * Stops the counter progress and closes the progress dialog window.
             *
             * @return {ProgressDialogElement}
             */
            stop : function()
            {
                this.close();

                if (progressIntervalId) {
                    clearInterval(progressIntervalId);
                    progressIntervalId = null;
                }

                return this;
            },

            /**
             * Sets title for the progress dialog window.
             *
             * @param {string} title
             * @return {ProgressDialogElement}
             */
            setTitle : function(title)
            {
                progressTitle.innerHTML = title;

                return this;
            },

            /**
             * Reset the progressbar and the counter.
             *
             * @return {ProgressDialogElement}
             */
            reset : function()
            {
                // We use the MDL class names.
                if (!progressBar.classList.contains('mdl-progress__indeterminate')) {
                    progressBar.classList.add('mdl-progress__indeterminate');
                }
                progressCounter.innerHTML = '';

                return this;
            }
        };
    };

    if (typeof Util === 'undefined') {
        throw new ReferenceError('The Util component is required to use this component.');
    }

    if (typeof Dialog === 'undefined') {
        throw new ReferenceError('The Dialog component is required to use this component.');
    }

    options.verbose && console.info(
        '%c✔%c the Progress Dialog component is loaded.',
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

            options.verbose && console.group('%c  looking for Progress Dialog Elements...', 'color:#cecece');

            progressDialogElement = document.querySelector('#'+options.dialogId);

            if (progressDialogElement) {
                if (typeof progressDialogElement.component === 'undefined'
                    || progressDialogElement.component.constructor.name !== 'DialogElement'
                ) {
                    throw new ReferenceError('The dialog element #'+options.dialogId+' is not registered as DialogElement.');
                }

                // Overwrite the element's component with the extended component.
                progressDialogElement.component = new ProgressDialogElement(progressDialogElement);
            }

            options.verbose && console.groupEnd();

            Util.triggerEvent(document, 'ProgressDialogComponentLoaded');
            initialized = true;
        }
    };
}(progressDialogOptions);
