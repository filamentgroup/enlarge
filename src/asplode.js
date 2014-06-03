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

	asplode.prototype.setOrigin = function( val ) {
		this.$img.css( {
			"webkitTransformOrigin": val,
			"mozTransformOrigin": val,
			"msTransformOrigin": val,
			"oTransformOrigin": val,
			"transformOrigin": val
		});
	};

	asplode.prototype.clearOrigin = function(){
		this.setOrigin( "" );
	};

	asplode.prototype.pinch = function( scale ){
		this.scale= scale;
		if( this.scale < 1 ){
			this.scale = 1;
		}
		this.setScale( "scale(" + this.scale + ")" );
	};

	asplode.prototype.out = function() {
		this.setOrigin( "50% 50%" );
		this.scrollToTL();
		this.updateScroll();
		this.scale-= this.scaleFactor;
		if( this.scale < 1 ){
			this.scale = 1;
		}
		this.setScale( "scale(" + this.scale + ")" );
	};

	asplode.prototype.in = function() {
		this.setOrigin( "50% 50%" );
		this.scrollToTL();
		this.updateScroll();
		this.scale+= this.scaleFactor;
		this.setScale( "scale(" + this.scale + ")" );
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

	asplode.prototype.scrollToCenter = function() {
		var scrollDiv = this.$element.children( 0 )[ 0 ];
		scrollDiv.scrollLeft = scrollDiv.scrollWidth / 2 - scrollDiv.offsetWidth / 2;
		scrollDiv.scrollTop = scrollDiv.scrollHeight / 2 - scrollDiv.offsetHeight / 2;
	};

	asplode.prototype.scrollToTL = function() {
		var $scrollDiv = this.$element.children( 0 )[ 0 ];
		$scrollDiv.scrollLeft = 0;
		$scrollDiv.scrollTop = 0;
	};

	asplode.prototype.updateScroll = function(){
		var self = this;
		this.$element.bind( "webkitTransitionEnd", function(){
			setTimeout(function(){
				self.clearOrigin();
				self.scrollToCenter();
			}, 0);
		} );
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
				self.scrollToCenter();
			} )
			// doubletap
			.bind( "touchend", function( e ){

				self.$element.removeClass( "asplode-notrans" );
				if( $( e.target ).closest( "nav" ).length > 0 ){
					return;
				}
				var thisTime = new Date().getTime();
				if( lastTouchTime && thisTime - lastTouchTime < 500 ){
					self.in();
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
