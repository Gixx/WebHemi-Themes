/**
 * Thomas theme for WebHemi
 *
 * @copyright 2012 - 2017 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

var Progress = {
    /* @var string */
    progressId: null,
    /* @var string */
    url: '/progress.php',
    /* @var HTMLElement */
    dialogWindow: null,
    /* @var HTMLElement */
    progressBar: null,
    /* @var HTMLElement */
    progressCounter: null,
    /* @var Number */
    progressInterval: null,

    /**
     * Initialize Component.
     */
    init: function ()
    {
        if (typeof Util === 'undefined') {
            throw new ReferenceError('The Util component is required to use this component.');
        }

        this.dialogWindow = document.getElementById('progress');
        this.progressBar = document.getElementById('progress-bar');
        this.progressCounter = document.getElementById('progress-counter');

        this.initialized = true;
        console.info('  + Progress component loaded.');
    },

    /**
     * Resets the progress modal dialog.
     *
     * @param {String} progressId
     */
    resetProgress: function (progressId)
    {
        this.progressId = progressId;
        if (!this.progressBar.classList.contains('mdl-progress__indeterminate')) {
            this.progressBar.classList.add('mdl-progress__indeterminate');
        }
        this.progressCounter.innerHTML = '';
    },

    /**
     * Shows the progress dialog and starts the counter.
     */
    start: function ()
    {
        if (this.progressBar.classList.contains('mdl-progress__indeterminate')) {
            this.progressBar.classList.remove('mdl-progress__indeterminate');
        }
        this.dialogWindow.showModal();
        this.progressInterval = setInterval(this.getProgressData.bind(this), 100);
        console.info('    * Progress started.');
    },

    /**
     * Stops the counter and closes the progress dialog.
     */
    stop: function ()
    {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        this.dialogWindow.close();
        this.resetProgress(this.progressId);

        console.info('    * Progress stopped.');
    },

    /**
     * Loads progress data.
     */
    getProgressData: function()
    {
        var _progress = this;

        Util.ajax({
            url: _progress.url+'?progress_id='+_progress.progressId,
            method: 'GET',
            success: function(data) {
                _progress.setCounter(data);
            }
        });
    },

    /**
     * Sets the counter text and the progress bar.
     *
     * @param data
     */
    setCounter: function (data)
    {
        this.progressCounter.innerHTML = data.current + ' out of ' + data.total;
        var counter = parseInt(Math.ceil(data.current / data.total * 100));
        this.progressBar.MaterialProgress.setProgress(counter);
    }
};
