/*
 * asplode plugin
 *
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under MIT
 */

(function( $, w ) {
	"use strict";

	var componentName = "asplode";

	var asplode = function( element, options ){
		if( !element ){
			throw new Error( "Element required to initialize object" );
		}
		this.element = element;
		this.$element = $( element );
		this.$img = this.$element.find( "img" );
		this.scale = 1;
		this.scaleFactor = options && options.scaleFactor || 1;
	};

	asplode.prototype.setScale = function( val ) {
		this.$img.css( {
			"webkitTransform": val,
			"mozTransform": val,
			"msTransform": val,
			"oTransform": val,
			"transform": val
		});
	};

	asplode.prototype.out = function() {
		this.scale-=this.scaleFactor;
		if( this.scale < 1 ){
			this.scale = 1;
		}
		this.setScale( "scale(" + this.scale + ")" );
	};

	asplode.prototype.in = function() {
		this.scale+=this.scaleFactor;
		this.setScale( "scale(" + this.scale + ")" );
	};

	asplode.prototype.buttons = function(){
		var self = this,
			$btns = $( "<nav><button class='" + componentName + "-in' title='Zoom in'>+</button><button class='" + componentName + "-out' title='Zoom Out'>-</button></nav>" );

		$btns.bind( "touchstart mousedown",function( e ){
			if( $( e.target ).is( "." + componentName + "-in" ) ){
				self.in();
			}
			else {
				self.out();
			}
			e.preventDefault();
		} );

		$btns.appendTo( this.element );
	};

	asplode.prototype.gestures = function() {
		var lastTouchTime,
			coords = [],
			self = this;

		this.$element
			.bind( "touchstart", function( e ){
				if( e.originalEvent.touches.length > 1 ){
					e.preventDefault();
					coords[ 0 ] = [ e.originalEvent.touches[ 0 ].pageX, e.originalEvent.touches[ 0 ].pageY ];
					coords[ 1 ] = [ e.originalEvent.touches[ 1 ].pageX, e.originalEvent.touches[ 1 ].pageY ];
				}
			} )
			.bind( "touchmove", function( e ){
				if( e.originalEvent.touches.length > 1 ){
					var thisCoords = [];
					thisCoords[ 0 ] = [ e.originalEvent.touches[ 0 ].pageX, e.originalEvent.touches[ 0 ].pageY ];
					thisCoords[ 1 ] = [ e.originalEvent.touches[ 1 ].pageX, e.originalEvent.touches[ 1 ].pageY ];

				}
			} );

		// doubletap
		this.$element
			.bind( "touchend", function( e ){
				if( $( e.target ).closest( "nav" ).length > 0 ){
					return;
				}
				var thisTime = new Date().getTime();
				if( lastTouchTime && thisTime - lastTouchTime < 500 ){
					self.in();
				}
				lastTouchTime = thisTime;
				e.preventDefault();
			} );
	};

	asplode.prototype.init = function() {
		this.buttons();
		this.gestures();
	};

	(w.componentNamespace = w.componentNamespace || w)[ componentName ] = asplode;
}( jQuery, this ));
