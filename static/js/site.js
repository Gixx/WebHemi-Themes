/**
 * Thomas theme for WebHemi
 *
 * @copyright 2012 - 2017 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

// When the DOM is ready, we make some customization
document.addEventListener("ThomasComponentsLoaded", function(event) {
    hljs.configure({
        tabReplace: '    ',
    });
    hljs.initHighlighting();
});
