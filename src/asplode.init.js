/*
 * asplode plugin
 *
 * Copyright (c) 2013 Filament Group, Inc.
 * Licensed under MIT
 */

/* global asplode:true */
(function( asplode, $, window, undefined ) {

	var pluginName = "asplode",
		initSelector = "." + pluginName;

	$.fn[ pluginName ] = function(){
		return this.each(function(){
			$( this ).data( pluginName, new window.componentNamespace[ pluginName ]( this ).init() );
		});
	};

	// auto-init on enhance (which is called on domready)
	$( document ).bind( "enhance", function( e ){
		$( initSelector, e.target )[ pluginName ]();
	});

}( asplode, jQuery, this ));
