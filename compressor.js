/**
 * Created by Sheldon Lee on 9/11/2016.
 */
var compressor = require('yuicompressor');

compressor.compress('test.js', {
    //Compressor Options:
    charset: 'utf8',
    type: 'js'
}, function(err, data, extra) {
    //err   If compressor encounters an error, it's stderr will be here
    //data  The compressed string, you write it out where you want it
    //extra The stderr (warnings are printed here in case you want to echo them
    console.log(err);
    console.log(data);
});