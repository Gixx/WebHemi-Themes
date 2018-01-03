/**
 * Thomas theme for WebHemi
 *
 * @copyright 2012 - 2018 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

if (typeof registryOptions === 'undefined') {
    var registryOptions = {
        verbose: ThomasOptions.verbose
    };
}

/**
 * Registry component.
 *
 * @type {{init, has, get, set, setConfig, unset}}
 */
var Registry = function(options)
{
    "use strict";

    /** @type {boolean} */
    var initialized = false;
    /** @var {Object} container   The associative array for key-value pairs */
    var container = {};

    if (typeof Util === 'undefined') {
        throw new ReferenceError('The Util component is required to use this component.');
    }

    options.verbose && console.info('%c✔%c the Regsitry component is loaded.', 'color:green; font-weight:bold;', 'color:black; font-weight:bold;');

    return {
        /**
         * Initializes the component.
         */
        init: function ()
        {
            Util.triggerEvent(document, 'RegistryComponentLoaded');
            initialized = true;
        },

        /**
         * Checks whether the the key is present in the container
         *
         * @param {string} key   The key to check
         * @return {boolean}     TRUE if exists, FALSE otherwise
         */
        has : function (key)
        {
            if (typeof Util === 'undefined') {
                options.verbose && console.error('The Util class had not been initialized yet');
                return false;
            }

            return Util.isset(container[key]);
        },

        /**
         * Retrieves the value for the given key
         *
         * @param {string} key          The key to look for
         * @param {string} defaultValue A default value to return if no such key.
         * @return {*}   The value if key is found, NULL/default otherwise
         */
        get : function (key, defaultValue)
        {
            return this.has(key) ? container[key] : (typeof defaultValue !== 'undefined' ? defaultValue : null);
        },

        /**
         * Set the value for a key
         *
         * @param {string} key    A unique ID
         * @param {*} value   The value to set
         * @return {Registry}
         */
        set : function (key, value)
        {
            container[key] = value;

            return this;
        },

        /**
         * Set key-value pairs
         *
         * @param {Object} param   Key-value pairs
         * @return {Registry}
         */
        setConfig : function (param)
        {
            if (Util.isObject(param)) {
                for (var key in param) {
                    this.set(key, param[key]);
                }
            }
            return this;
        },

        /**
         * Removes a key from the container
         *
         * @param {string} key   The key to delete
         * @return {Registry}
         */
        unset : function (key)
        {
            if (this.has(key)) {
                container[key] = undefined;
            }
            return this;
        }
    }
}(registryOptions);
