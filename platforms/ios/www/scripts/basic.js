/*
 * SimpleModal Basic Modal Dialog
 * http://simplemodal.com
 *
 * Copyright (c) 2013 Eric Martin - http://ericmmartin.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

/*jQuery(function ($) {
	// Load dialog on page load
	//$('#basic-modal-content').modal();

	// Load dialog on click
	$('.swipebox img').click(function (e) {
		alert("entro a esta funcion")
		$('#basic-modal-content').modal();

		return false;
	});
});*/

function abrirModal(element){
    var src=$(element).attr( "src" )
    $('#rect').attr('src',src)
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ancho=windowWidth-(windowWidth/10);
	$("#basic-modal-content").dialog({
    modal: true,
    draggable: false,
    resizable: false,
    minWidth:ancho,
    //position: ['center', 'top'],
    my: "center",
   at: "center",
   of: window,
    show: 'blind',
    hide: 'blind',
    dialogClass: 'prueba',
    buttons: {
        "cerrar": function() {
            $(this).dialog("close");
        }
    }
});
zoom();   
}

function zoom(){
     if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
        Hammer.plugins.fakeMultitouch();
    }

    var hammertime = Hammer(document.getElementById('pinchzoom'), {
        preventDefault      : true,
        transformMinScale   : 1,
        dragBlockHorizontal : true,
        dragBlockVertical   : true,
        dragMinDistance     : 0
    });

    var rect = document.getElementById('rect');

    var posX = 0, posY = 0,
    scale = 1, last_scale = 1,
    rotation = 0, last_rotation = 0;

    hammertime.on('touch drag transform', function(ev) {
        switch(ev.type) {
            case 'touch':
            last_scale = scale;
            last_rotation = rotation;
            break;

            case 'drag':
            posX = ev.gesture.deltaX;
            posY = ev.gesture.deltaY;
            break;

            case 'transform':
        rotation = 0;//last_rotation + ev.gesture.rotation;
        scale = Math.max(1, Math.min(last_scale * ev.gesture.scale, 10));
        break;
    }

    // transform!
    var transform =
    "translate3d(" + posX + "px," + posY + "px, 0) " +
    "scale3d(" + scale + "," + scale + ", 1) " +
    "rotate(" + rotation + "deg) ";

    rect.style.transform = transform;
    rect.style.oTransform = transform;
    rect.style.msTransform = transform;
    rect.style.mozTransform = transform;
    rect.style.webkitTransform = transform;
});
}