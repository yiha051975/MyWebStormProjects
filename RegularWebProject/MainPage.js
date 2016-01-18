'use strict';
/**
 * Created by Sheldon Lee on 6/14/2015.
 */
(function() {
    var sliderTest = new com.sheldon.slider({
        max: 500000,
        min: 50000,
        value: 50000,
        step: 5000,
        length: 600,
        enableClickRail: true,
        valueChange: valueChange
    });

    sliderTest.renderSlider('.slider-test');

    /*var sliderTest2 = new com.sheldon.slider({
        max: 20,
        min: 0,
        value: 0,
        step: 1,
        length: 600,
        enableClickRail: true,
        valueChange: valueChange
    });

    sliderTest2.renderSlider('.yui-slider-test');*/

    function valueChange(event, newValue) {
        console.log(event);
        console.log(newValue);
    }
}());