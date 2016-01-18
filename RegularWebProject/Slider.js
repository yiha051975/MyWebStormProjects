'use strict';
/**
 * Created by Sheldon Lee on 6/13/2015.
 */
var com = com || {};
com.sheldon = com.sheldon || {};

com.sheldon = (function() {
    var defaultSliderAttr = {
        max: 100,
        min: 0,
        value: 0,
        step: 1,
        length: 150,
        enableClickRail: false
    };
    var idIndex = 0;

    var sliderHTML =    '<div class="slider" id="{0}" style="width:{3}px;">' +
                            '<div class="slider-rail" id="{1}">' +
                                '<div class="slider-thumb" tabindex="0" id="{2}"></div>' +
                            '</div>' +
                        '</div>';

    var slider = function(attr) {
        if (!(this instanceof com.sheldon.slider)) {
            return new com.sheldon.slider(attr);
        }
        var value;
        this.attr = mapAttr(attr);
        this.sliderId = 'slider' + getIdIndex();
        this.sliderRailId = 'slider-rail' + getIdIndex();
        this.sliderThumbId = 'slider-thumb' + getIdIndex();
        //this.mouseDown = false;
        var that = this;

        this.startSlider = function() {
            document.addEventListener('mousemove', mouseMoveEventListener, false);

            document.addEventListener('mouseup', mouseUpEventListener, false);
        };

        this.clickRailEventListener = function() {
            this.sliderRailNode.addEventListener('mousedown', function (event) {
                event.preventDefault();
                that.sliderThumbNode.focus();

                if (that.attr.railClickCallBack && typeof that.attr.railClickCallBack === 'function') {
                    that.attr.railClickCallBack(event, that.attr.value);
                }
                that.updateDragger(event);
                return false;
            }, false);

            this.sliderRailNode.addEventListener('mouseup', function(event) {
                event.preventDefault();
            }, false);
        };

        this.get = function(variable) {
            if (variable && typeof variable === 'string') {
                return that.attr[variable];
            }
        };

        this.set = function(variable, value) {
            if (variable && value && typeof variable === 'string' && that.attr[variable] !== undefined) {
                that.attr[variable] = value;
                this.updateDraggerByValue(variable);
            }
        };

        function stopSlider() {
            document.removeEventListener('mousemove', mouseMoveEventListener, false);
            document.removeEventListener('mouseup', mouseUpEventListener, false);
        }

        function mouseMoveEventListener(event) {
            that.updateDragger(event);
            return false;
        }

        function mouseUpEventListener(event) {
            stopSlider();

            if (that.attr.slideEnd && typeof that.attr.slideEnd === 'function') {
                that.attr.slideEnd(event, that.attr.value);
            }
            return false;
        }
    };

    slider.prototype.renderSlider = function(destination) {
        var sliderPrototype = this;

        var destNode = document.querySelector(destination);

        if (destNode) {
            destNode.innerHTML = sliderHTML.format(this.sliderId, this.sliderRailId, this.sliderThumbId, this.attr.length);
            this.sliderNode = document.getElementById(this.sliderId);
            this.sliderRailNode = document.getElementById(this.sliderRailId);
            this.sliderThumbNode = document.getElementById(this.sliderThumbId);
            this.factor =  this.getFactor();

            this.sliderThumbNode.addEventListener('mousedown', function(event) {
                event.preventDefault();
                this.focus();

                if (sliderPrototype.attr.slideStart && typeof sliderPrototype.attr.slideStart === 'function') {
                    sliderPrototype.attr.slideStart(event);
                }

                //sliderPrototype.mouseDown = true;
                sliderPrototype.startSlider();
                return false;
            });

            if (this.attr.enableClickRail) {
                this.clickRailEventListener();
            }
        }
    };

    slider.prototype.updateDragger = function(event) {
        var offset;
        var value;

        offset = event.pageX - this.sliderThumbNode.offsetParent.offsetLeft - (this.sliderThumbNode.offsetWidth / 2);

        if (offset >= 0 && offset <= this.attr.length - this.sliderThumbNode.offsetWidth) {
            value = offsetToValue(offset, this.factor, this.attr.step, this.attr.min);

            if (this.attr.value !== value) {
                this.attr.value = value;

                if (this.attr.valueChange && typeof this.attr.valueChange === 'function') {
                    this.attr.valueChange(event, this.attr.value);
                }
            }

            this.sliderThumbNode.style.left = offset + 'px';
        }
    };

    slider.prototype.updateDraggerByValue = function(variable) {
        var offset;

        if (variable && typeof variable === 'string') {
            if (variable === 'length') {
                this.sliderNode.style.width = this.attr.length + 'px';
                this.factor = this.getFactor();
            } else if (variable === 'min' || variable === 'max' || variable === 'step') {
                this.factor = this.getFactor();
            }

            if (this.attr.value <= this.attr.max && this.attr.value >= this.attr.min) {
                offset = (this.attr.value - this.attr.min) / this.factor;
                this.sliderThumbNode.style.left = offset + 'px';
            }
        }
    };

    slider.prototype.getFactor = function() {
        return (this.attr.max - this.attr.min) / (this.attr.length - this.sliderThumbNode.offsetWidth);
    };

    function mapAttr(attr) {
        if (!attr) {
            attr = {};
        }

        for (var key in defaultSliderAttr) {
            if (!attr[key]) {
                attr[key] = defaultSliderAttr[key];
            }
        }

        return attr;
    }

    function getIdIndex() {
        idIndex ++;

        return idIndex;
    }

    function offsetToValue(offset, factor, step, min) {
        var value = offset * factor + min;
        if (value % step !== 0) {
            value = value - value % step;
        }
        return value;
    }

    return {
        slider: slider
    };
}());

/*
YUI().use('node', 'event', 'slider',function (Y) {
    // The Node and Event modules are loaded and ready to use.
    // Your code goes here!
    var slider = new Y.Slider({
        axis        : 'x',
        min         : 50000,
        max         : 500000,
        value       : 0,
        length      : 600,
        after       : {
            valueChange: Y.bind(sliderUpdate),
            thumbMove: Y.bind(sliderStart)
        }
    });
    slider.render('.yui-slider-test');
});

function sliderUpdate(e) {

}

function sliderStart(e) {
    console.log(e);
}*/
