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
		this.$scroller = this.$element.find( ".asplode-zoom" );
		this.scale = 1;
		this.minScale = 1;
		this.maxScale = 2;
		this.scaleFactor = options && options.scaleFactor || 1;
	};

	asplode.prototype.setScale = function( val ) {
		this.$img.css( {
			"width": val * 100 + "%"
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

	asplode.prototype.setMaxHeight = function(){
		this.$scroller.css( "padding-top", this.$scroller[ 0 ].offsetHeight / this.$scroller[ 0 ].offsetWidth * 100 + "%" );
		this.$element.addClass( "asplode-basic" );
		this.$img[ 0 ].offsetLeft;
	};

	asplode.prototype.out = function() {
		this.scale-= this.scaleFactor;
		if( this.scale < this.minScale ){
			this.scale = this.minScale;
		}
		this.setScale( this.scale );
	};

	asplode.prototype.in = function() {
		this.setMaxHeight();
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

	asplode.prototype.toggleZoom = function(){
		if( this.scale === this.maxScale ){
			this.out();
		}
		else {
			this.in();
		}
	};


	asplode.prototype.gestures = function() {
		var lastTouchTime,
			hoverDisable = false,
			self = this;

		// doubletap
		this.$element
			.bind( "touchstart", function(){
				hoverDisable = true;
			} )
			.bind( "touchend", function( e ){
				hoverDisable = false;
				if( $( e.target ).closest( "nav" ).length > 0 ){
					return;
				}
				var thisTime = new Date().getTime();
				if( lastTouchTime && thisTime - lastTouchTime < 500 ){
					self.toggleZoom();
				}
				lastTouchTime = thisTime;
				e.originalEvent.preventDefault();

			} )
			.bind( "dblclick", function(){
				self.toggleZoom();
			})
			.bind( "mouseover mousemove", function( e ){
				if( self.scale === self.minScale || hoverDisable ){
					return;
				}
				self.$scroller[ 0 ].scrollLeft = ( e.pageX - self.$element[ 0 ].offsetLeft ) * self.scale;
				self.$scroller[ 0 ].scrollTop = ( e.pageY- self.$element[ 0 ].offsetTop ) * self.scale;
			});
	};

	asplode.prototype.init = function() {
		this.buttons();
		this.gestures();
	};

	(w.componentNamespace = w.componentNamespace || w)[ componentName ] = asplode;
}( jQuery, this ));
