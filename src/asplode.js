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
		this.minScale = 1;
		this.maxScale = 2;
		this.scaleFactor = options && options.scaleFactor || 1;
	};

	asplode.prototype.setScale = function( val ) {
		val = "scale(" + val + ")";
		this.$img.css( {
			"webkitTransform": val,
			"mozTransform": val,
			"msTransform": val,
			"oTransform": val,
			"transform": val
		});
	};

	asplode.prototype.pinch = function( scale ){
		this.scale= scale;
		if( this.scale < this.minScale ){
			this.scale = this.minScale;
		}
		if( this.scale > this.maxScale ){
			this.scale = this.maxScale;
		}
		this.setScale( this.scale );
	};

	asplode.prototype.out = function() {
		this.scale-= this.scaleFactor;
		if( this.scale < this.minScale ){
			this.scale = this.minScale;
		}
		this.setScale( this.scale );
	};

	asplode.prototype.in = function() {
		this.scale+= this.scaleFactor;
		if( this.scale > this.maxScale ){
			this.scale = this.maxScale;
		}
		this.setScale( this.scale );
	};


	asplode.prototype.buttons = function(){
		var self = this,
			$btns = $( "<nav><button class='" + componentName + "-in' title='Zoom in'>+</button><button class='" + componentName + "-out' title='Zoom Out'>-</button></nav>" );

		$btns.bind( "touchend mouseup",function( e ){
			self.$element.removeClass( "asplode-notrans" );
			if( $( e.target ).is( "." + componentName + "-in" ) ){
				self.in();
			}
			else {
				self.out();
			}
			e.originalEvent.preventDefault();
		} );

		$btns.appendTo( this.element );
	};


	asplode.prototype.gestures = function() {
		var lastTouchTime,
			startScale,
			pinchX,
			pinchY,
			self = this;

		this.$element
			.bind( "touchstart", function( e ){
				self.$element.addClass( "asplode-notrans" );
			})
			.bind( "gesturestart", function( e ){
				e.originalEvent.preventDefault();
				startScale = self.scale;
			})
			.bind( "gesturechange", function( e ){
				var scale = e.originalEvent.scale * startScale;
				self.pinch( scale );
			} )
			// doubletap
			.bind( "touchend", function( e ){
				self.$element.removeClass( "asplode-notrans" );
				if( $( e.target ).closest( "nav" ).length > 0 ){
					return;
				}
				var thisTime = new Date().getTime();
				if( lastTouchTime && thisTime - lastTouchTime < 500 ){
					if( self.scale === self.maxScale ){
						self.out();
					}
					else {
						self.in();
					}
				}
				lastTouchTime = thisTime;
				e.originalEvent.preventDefault();

			} )
			.bind( "mouseover", function( e ){
				//var scale =
			});

	};

	asplode.prototype.init = function() {
		this.buttons();
		this.gestures();
	};

	(w.componentNamespace = w.componentNamespace || w)[ componentName ] = asplode;
}( jQuery, this ));
