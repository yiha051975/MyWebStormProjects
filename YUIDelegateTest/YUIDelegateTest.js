/**
 * Created by Sheldon Lee on 12/2/2016.
 */
// Create a YUI sandbox on your page.
var YUInstance;
YUI().use('node', 'event', 'event-custom', 'node-event-delegate', 'event-key', 'node-event-simulate', function (Y) {
    // The Node and Event modules are loaded and ready to use.
    // Your code goes here!
    YUInstance = Y;
    var divContainer = Y.one('.div-containers');



    Y.on('domready', function() {
        if (divContainer) {
            divContainer.delegate('click', function(e) {
                console.log('test');
                e.target.ancestor('a').fire('testEvent');
            }, 'a');
            Y.on('testEvent', function(e) {
                console.log('testEvent fired.');
                console.log(e.target);
            }, 'a');
        }
    });
});