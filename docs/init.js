// DOM-ready auto-init of plugins.
// Many plugins bind to an "enhance" event to init themselves on dom ready, or when new markup is inserted into the DOM
(function( $ ){
	$( function(){
		$(".enlarge.inline-demo").data("options", {
			button: true,
			hoverZoomWithoutClick: true,
			delay: 300,
			flyout: {
				width: 300,
				height: 300
			},
			placement: "inline",
			magnification: 5
		});


		$( document ).bind( "enhance", function(){
			$( "body" ).addClass( "enhanced" );
		});

		$( document ).trigger( "enhance" );
	});
}( jQuery ));
