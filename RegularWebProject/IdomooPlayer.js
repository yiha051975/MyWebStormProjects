/**
 * Created by Sheldon Lee on 11/10/2015.
 */
$(document).ready(function() {
    console.log('document is ready');
    var myEnvironment = 'https://idoplayer.idomoo.com/15/';

    $('.dialog').dialog({
        autoOpen: false,
        width: 640,
        height: 409,
        close: function(e, ui) {
            Idm.Engine.playerApiCtrl({action: 'pause'});
        }
    });

    window.IdmEngineCallback = function(){
        Idm.Engine.init({
            domain: myEnvironment,
            uak: "pv5prodeu",
            url: 'xyz.idomoo.com/videos/samples/VideoForPlayer.mp4',
            "autostart": '0',
            api: {
                onPause: function () {
                    console.log('onPause is fired');
                },
                onPlay: function(){
                    console.log('onPlay is fired');
                },
                onComplete: function() {
                    console.log('onComplete is fired');
                }
            }
        });
    };

    $('.flow-wrapper').on('click', '#pause', function(e) {
        $( ".dialog" ).dialog( "open" );
        Idm.Engine.playerApiCtrl({action: "pause"});
    });

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = myEnvironment + '/assets/js/eng.js';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'idomooEngine'));
});