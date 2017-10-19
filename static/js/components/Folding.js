/**
 * Thomas theme for WebHemi
 *
 * @copyright 2012 - 2017 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

var Folding = {
    /** @var {bool} initialized  TRUE if the component is initialized */
    initialized : false,

    /** @var {Object} */
    folderContainer: {},

    /**
     * Initialize Component
     */
    init : function()
    {
        this.initialized = true;
        console.info('  + Folding component loaded.');

        this.initFoldingElements();
    },

    /**
     * Retrieve the Folding element handler object.
     *
     * @param identifier
     * @returns {FoldingElement}
     */
    getFolderHandler : function(identifier) {
        return this.folderContainer[identifier];
    },

    /**
     * Collect and initialize Folding elements
     */
    initFoldingElements : function()
    {
        var folders = document.querySelectorAll('.foldable');
        for (var i = 0, len = folders.length; i < len; i++) {
            var id = folders[i].getAttribute('id');
            var folderHandler = new FoldingElement(folders[i]);
            folderHandler.init();
            this.folderContainer[id] = folderHandler;
        }
    }
};

/**
 * Folding element handler class.
 *
 * @param HTMLElement
 * @constructor
 */
function FoldingElement(HTMLElement) {
    /**
     * @var HTMLElement
     */
    this.HTMLBlock = HTMLElement;

    /**
     * @var HTMLElement
     */
    this.toggleElement = null;

    /**
     * @var HTMLElement
     */
    this.wrapperElement = null;
}

FoldingElement.prototype = (function() {
    /**
     * Retrive the HTML element
     *
     * @returns {HTMLElement}
     */
    function getTarget() {
        return this.HTMLBlock;
    }

    /**
     * Submit event handler
     *
     * @param {Event} event
     * @private
     */
    function toggle(event) {
        event.preventDefault();

        var isActive = this.HTMLBlock.classList.contains('is_active');

        if (isActive) {
            this.HTMLBlock.classList.remove('is_active');
            this.wrapperElement.style.height = 0;
        } else {
            this.HTMLBlock.classList.add('is_active');
            var style = window.getComputedStyle(this.wrapperElement.children[0]);
            this.wrapperElement.style.height = (parseInt(style.height) + 15) + 'px' ;
        }
    }

    /**
     * Set event handler for the HTML element
     */
    function init()
    {
        this.wrapperElement = this.HTMLBlock.querySelector('div.wrapper');

        this.toggleElement = this.HTMLBlock.querySelector('header.folder');
        this.toggleElement.addEventListener('click', toggle.bind(this), true);
        console.info('    + a Folding element is initialized (#'+this.HTMLBlock.getAttribute('id')+')');
    }

    return {
        /**
         * Constructor
         */
        constructor:FoldingElement,

        /**
         * Private method caller
         * @param {Function} callback
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
        getTarget: function() { return this._(getTarget)(); }
    };
})();
