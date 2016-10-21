/**
 * Created by Sheldon Lee on 9/20/2016.
 */
$(document).ready(function() {
    var cards = [];
    var currentOffsetTop;
    var currentOffsetLeft;
    $('.card').each(function(index, node) {
        var $node = $(node);
        var offset = $node.offset();
        currentOffsetTop = offset.top;

        if (cards.length === 0) {
            cards.push([node]);
        } else if (cards.length - 1 === index) {
            cards.push([node]);
        } else {
            cards.push()
        }
    });

    $(document).on('mousedown', '[data-ripple]', function(e) {
        var $self = $(this);

        if($self.closest("[data-ripple]")) {
            e.stopPropagation();
        }

        var initPos = $self.css("position"),
            offs = $self.offset(),
            w = Math.min(this.offsetWidth, 160),
            h = Math.min(this.offsetHeight, 160),
            x = e.pageX - offs.left,
            y = e.pageY - offs.top,
            $ripple = $('<div/>', {class : "ripple",appendTo : $self });

        if(!initPos||initPos==="static") {
            $self.css({position:"relative"});
        }

        $('<div/>', {
            class : "rippleWave",
            css : {
                background: $self.data("ripple"),
                width: h / 2,
                height: h / 2,
                left: x - (h / 4),
                top: y - (h / 4),
            },
            appendTo : $ripple,
            one : {
                animationend : function(){
                    $ripple.remove();
                }
            }
        });
    });

    $(document).on('mousedown', '[data-expand-collapse]', function(e) {
        var card = e.target;
        var $card = $(card);

        if($card.closest(".card")) {
            e.stopPropagation();
        }

        if (card.isExpanded) {
            $card.velocity({
                height: 100,
                marginTop: 100
            },{
                duration: 300,
                queue: false,
                easing: [0.4, 0.0, 0.2, 1]
            }).velocity({
                width: 100,
                marginLeft: 100
            },{
                duration: 300,
                delay: 35,
                queue: false,
                easing: [0.4, 0.0, 0.2, 1]
            });
            card.isExpanded = false;
        } else {
            $card.velocity({
                width: 300,
                marginLeft: 50
            },{
                duration: 300,
                queue: false,
                easing: [0.4, 0.0, 0.2, 1]
            }).velocity({
                height: 300,
                marginTop: 50
            },{
                duration: 300,
                queue: false,
                delay: 35,
                easing: [0.4, 0.0, 0.2, 1]
            });
            card.isExpanded = true;
        }
    });
});