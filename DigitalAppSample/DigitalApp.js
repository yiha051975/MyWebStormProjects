/**
 * Created by iti8218 on 10/18/2016.
 */
$(function() {
    var currentOffsetLeft, currentOffsetTop, currentXIndex, currentYIndex;
    var cards = undefined;
    var $cards = $('.card');

    getCards();

    cards.forEach(function(cardArr, i) {
        $(cardArr).velocity({
            opacity: 1
        },{
            duration: 300,
            delay: i * 75,
            easing: [.4, 0, .6, 1],
            queue: false
        }).velocity({
            width: 100,
            height: 100,
            marginLeft: 50,
            marginTop: 50,
            marginRight: 0,
            marginBottom: 0
        },{
            duration: 600,
            delay: i * 75,
            easing: [.4, 0, .2, 1],
            queue: false
        });
    });

    $(document).on('click', '[data-expand-collapse]', function(e) {
        var card = e.target;
        var $card = $(card);

        if ($card.closest('[data-expand-collapse]')) {
            e.stopPropagation();
        }

        if (!card.isExpanded) {
            $card.velocity({
                width: 300,
                marginLeft: 50
            }, {
                duration: 300,
                queue: false,
                easing: [.4, 0, .2, 1]
            }).velocity({
                height: 300,
                marginTop: 50
            }, {
                duration: 300,
                delay: 35,
                easing: [.4, 0, .2, 1],
                queue: false
            });
            card.isExpanded = true;
        } else {
            $card.velocity({
                height: 100,
                marginTop: 50
            }, {
                duration: 300,
                queue: false,
                easing: [.4, 0, .2, 1]
            }).velocity({
                width: 100,
                marginLeft: 50
            }, {
                duration: 300,
                delay: 35,
                easing: [.4, 0, .2, 1],
                queue: false
            });
            card.isExpanded = false;
        }
    });

    $(document).on('click', '[data-ripple-effect]', function(e) {
        var node = e.target;
        var $node = $(node);

        if ($node.closest('[data-ripple-effect')) {
            e.stopPropagation();
        }

        var initPos = $node.css('position'),
            offs = $node.offset(),
            w = Math.min(this.offsetWidth, 160),
            h = Math.min(this.offsetHeight, 160),
            x = e.pageX - offs.left,
            y = e.pageY - offs.top,
            $ripple = $('<div />', {class: 'ripple', appendTo: $node});

        if (!initPos || initPos === 'static') {
            $node.css({position: 'relative'});
        }

        $('<div/>', {
            class : "ripple-effect",
            css : {
                background: $node.data('ripple-effect') ? $node.data('ripple-effect') : '#CCC',
                width: h / 2,
                height: h / 2,
                left: x - (h/4),
                top: y - (h/4),
            },
            appendTo : $ripple,
            one : {
                animationend : function(){
                    $ripple.remove();
                }
            }
        });
    });

    function getCards() {
        cards = [];

        $cards.each(function(index, node) {
            var $node = $(node);
            var offset = $node.offset();
            var i = 0;

            if (0 === index) {
                currentOffsetLeft = offset.left;
                currentOffsetTop = offset.top;
                currentXIndex = 0;
                currentYIndex = 0;
                cards.push([node])
            } else {
                if (currentOffsetTop !== offset.top) {
                    currentOffsetTop = offset.top;
                    currentYIndex++;
                    currentXIndex = -1;
                }
                if (currentOffsetLeft !== offset.left) {
                    currentOffsetLeft = offset.left;
                    currentXIndex++;
                }

                i = currentXIndex + currentYIndex;

                if (i > cards.length - 1) {
                    cards.push([node]);
                } else {
                    cards[currentXIndex + currentYIndex].push(node);
                }
            }
        });
    }
});