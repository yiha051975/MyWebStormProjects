'use strict';
/**
 * Created by Sheldon Lee on 6/14/2015.
 */

String.prototype.format = function() {
    var formattedString = this;
    var strArray = Array.prototype.slice.call(arguments);
    var pattern;
    strArray.forEach(function(value, index) {
        pattern = new RegExp("\\{" + index + "\\}", "g");
        formattedString = formattedString.replace(pattern, value && typeof value === 'string' ? value : '');
    });
    return formattedString;
}