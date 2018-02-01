/*
 * enlarge plugin
 *
 * Copyright (c) 2013 Filament Group, Inc.
 * Licensed under MIT
 */

/* global enlarge:true */
(function( $, window, undefined ) {

	var pluginName = "enlarge",
		initSelector = "." + pluginName;

	// auto-init on enhance (which is called on domready)
	$( document ).bind( "enhance", function( e ){
		$( initSelector, e.target )[ pluginName ]({placement: "flyoutloupe", flyout: { width: 300, height: 300 }, magnification: 5});
	});

}( jQuery, this ));
