// DOM-ready auto-init of plugins.
// Many plugins bind to an "enhance" event to init themselves on dom ready, or when new markup is inserted into the DOM
(function( $ ){


  $(".enlarge.inline-demo").data("options", {
    hoverZoomWithoutClick: true,
    delay: 300,
    flyout: {
      width: 400,
      height: 600
    },
    placement: "flyoutloupe",
    magnification: 3
  });


	$( function(){
		$( document ).bind( "enhance", function(){
			$( "body" ).addClass( "enhanced" );
		});

		$( document ).trigger( "enhance" );
	});
}( jQuery ));