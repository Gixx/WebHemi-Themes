/**
 * Thomas theme for WebHemi
 *
 * @copyright 2012 - 2018 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

// When the DOM is ready, we make some customization
document.addEventListener("ThomasComponentsLoaded", function(event) {
    hljs.configure({
        tabReplace: '    '
    });
    hljs.initHighlighting();

    var moods = document.querySelectorAll('span.mood');
    for (var i = 0, num = moods.length; i < num; i++) {
        moods[i].innerHTML = emojione.toImage(moods[i].innerText);
    }

    var sidebar = document.querySelector('body > nav');
    Stickyfill.add(sidebar);

    document.querySelectorAll('body > header > .container > a').forEach(function(element) {
        element.addEventListener('click', function(e) {
            e.preventDefault();

            var drawerElementTag = e.target.classList[0];
            var menu = document.querySelector('body > '+drawerElementTag);
            if (menu.classList.contains('open')) {
                menu.classList.remove('open');
                menu.classList.add('closing');
                setTimeout(function(){
                    menu.classList.remove('closing');
                }, 1000);
            } else {
                menu.classList.add('opening');
                setTimeout(function(){
                    menu.classList.remove('opening');
                    menu.classList.add('open');
                }, 1000);
            }
        });
    });
});
