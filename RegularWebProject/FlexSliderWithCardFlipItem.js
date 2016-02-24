/**
 * Created by Sheldon Lee on 2/23/2016.
 */
(function() {
    var turnLink = document.querySelector('.flippedToBack');
    var returnLink = document.querySelector('.flippedToFront');
    var content = document.querySelector('.content');

    turnLink.addEventListener('click', function(e) {
        content.classList.add('flipped');
    }, false);

    returnLink.addEventListener('click', function(e) {
        content.classList.remove('flipped');
    }, false);
})();