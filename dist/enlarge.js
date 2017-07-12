/*! fg-enlarge - v0.2.0 - 2017-05-30
* Copyright (c) 2017 Scott Jehl, Filament Group, Inc.; Licensed  */
;(function( w ){

 	var enlarge = function(){
 		var $ = w.jQuery;
 		var pluginName = "enlarge";
 		$.fn[ pluginName ] = function( options ){
 			var pluginArgs = arguments;

 			// options
 			var o = {
 				button: true,
 				hoverZoomWithoutClick: true,
 				delay: 300,
 				flyout: {
 					width: 200,
 					height: 200
 				},
 				placement: "inline",
 				magnification: 3
 			};

 			if( typeof options !== "string" ) {
 				// extend with passed options
 				o = $.extend( o, options );
 			}

 			var internalResult;

 			var result = this.each(function(){
 				var $element = $(this);

 				var self = this;
 				var testimg = w.document.createElement( "img" );
 				var srcsetSupported = "srcset" in testimg;
 				var srcsetSizesSupported = srcsetSupported && "sizes" in testimg;
 				var $anchor = $( this ).find( "a" );

 				// find image within container
 				var initialImg = $element.find( "img" )[ 0 ];
 				var targetImg = initialImg;
 				var imgOriginalSrc = targetImg.src;
 				var srcset = $( targetImg ).attr( "srcset" );
 				var imgOriginalSizes = $( targetImg ).attr( "sizes" );
 				var imgZoomSrc = $anchor[ 0 ].href;
 				var initialText = $anchor[ 0 ].innerText;
 				var zoomClass = pluginName + "-zoomed";
 				var delayClass = pluginName + "-delay";
 				var $contain = $( targetImg ).closest( ".enlarge_contain" );
 				var $zoomContain = $contain;
 				var $parentPane = $( targetImg ).closest( ".enlarge_pane" ) || $element;
 				var $zoomParent = $parentPane;
 				var zoomed = $element.data("zoomed") || false;
 				$element.data("zoomed", zoomed);
 				var lockedZoom = false;
 				var lockZoomClass = pluginName + "-locked";

 				// this allows for methods and changing options in subsequent calls to the plugin
 				if( typeof options === "string" ) {
 					var args = Array.prototype.slice.call(pluginArgs, 1);

 					switch(options){
 					case "in":
 						if( !$element.data("zoomed") ){
 							standardToggleZoom();
 						}
 						break;
 					case "out":
 						if( $element.data("zoomed") ){
 							standardToggleZoom();
 						}
 						break;
 					case "isZoomed":
 						internalResult = $element.data("zoomed");
 						break;
 					case "updateOptions":
 						$element.data( "updateUptions" )( args[ 0 ] );
 						break;
 					}
 					return;
 				}

 				// to toggle between inline and flyout modes, we change the elements that
 				// the targetImg, zoomParent, and zoomContain vars refer to
 				function updatePlacement(){
 					if( o.placement === "inline" ){
 						targetImg = initialImg;
 						$zoomParent = $parentPane;
 						$zoomContain = $contain;
 					} else {
 						targetImg = $flyout.find( "img" )[ 0 ];
 						$zoomParent = $zoomContain = $flyout;
 					}
 				}

 				// this positions the loupe or side flyout element either according to mouse/touch coordinates
 				// or the sides of the viewer specified
 				function positionFlyout(){

 					// set flyout width and height
 					$flyout.css({
 						"width": o.flyout.width + "px",
 						"height": o.flyout.height + "px",
 						top: "",
 						left: "",
 						"margin-left": "",
 						"margin-top": ""
 					});

 					// set negative left or right value to match width
 					var flyoutSide = o.placement.match( /left|right/ );

 					if( flyoutSide ){
 						$flyout.css( flyoutSide[ 0 ], -o.flyout.width + "px" );
 					}
 					// if loupe mode, center offset
 					var loupe = o.placement.match( /loupe/ );

 					if( loupe ) {
 						// loupe
 						$flyout.css({
 							"margin-left": ( -o.flyout.width / 2 ) + "px",
 							"margin-top": ( -o.flyout.height / 2 ) + "px"
 						});
 					}

 					// add class to specify positioning spot for static css to apply
 					$flyout[ 0 ].className = $flyout[ 0 ].className.replace( /enlarge_flyout\-[^$\s]+/, ' ' );
 					$flyout.addClass( "enlarge_flyout-" +	 o.placement );
 				}

 				// this allows for subsequent calls to the plugin to pass an updateOptions method and object,
 				// which will pass through to the existing viewer on that element
 				$element.data( "updateUptions", function( opts ){
 					o = opts;
 					updatePlacement();
 					positionFlyout();
 					hoverEnabled = o.hoverZoomWithoutClick;
 					if( o.image.sizes ){
 						imgOriginalSizes = o.image.sizes;
 						toggleImgSrc();
 					}

					if( o.disabled && zoomed ) {
						standardToggleZoom();
					}
 				});

 				// loader div holds a new image while its new source is loading
 				// we insert this into the dom so that srcset/sizes can calculate a best source
 				function addLoader(){
 					$contain.append( '<i class="enlarge_loader"><i></i></i>' );
 				}

 				// zoom state toggle boolean
 				function toggleZoomState(){
 					zoomed = !zoomed;
 					$element.data("zoomed", zoomed);
 				}

 				// toggle the image source bigger or smaller
 				// ideally, this toggles the sizes attribute and allows the browser to select a new source from srcset
 				// if srcset isn't supported or sizes attribute is not provided, the link href is used for the larger source
 				function toggleImgSrc(){
 					if( !zoomed ){
 						targetImg.sizes = imgOriginalSizes;
 						if( !srcsetSizesSupported ){
 							targetImg.src = imgOriginalSrc;
 						}
 					} else {
 						var zoomimg = new Image();
 						zoomimg.className = "enlarge_img-loading";
 						$( zoomimg ).insertBefore( targetImg );

 						zoomimg.onload = function(){
 							targetImg.sizes = zoomimg.sizes;
 							if( !srcsetSizesSupported ){
 								targetImg.src = imgZoomSrc;
 							}
 							$( zoomimg ).remove();
 						};
 						zoomimg.sizes = imgZoomWidth() + "px";
 						zoomimg.srcset = srcset;
 						if( !srcsetSizesSupported ){
 							zoomimg.src = imgZoomSrc;
 						}
 					}
 				}

 				// scroll to the center of the zoomed image
 				function scrollToCenter(){
 					var pw = $zoomContain.width();
 					var ph = $zoomContain.height();
 					var w = targetImg.offsetWidth;
 					var h = targetImg.offsetHeight;
 					$zoomContain[ 0 ].scrollLeft = ( w / 2 ) - ( pw / 2 );
 					$zoomContain[ 0 ].scrollTop = ( h / 2 ) - ( ph / 2 );
 				}

 				// lock zoom mode allows for scrolling around normally without a cursor-follow behavior
 				function toggleLockZoom(){
 					if( !lockedZoom ){
						// NOTE we allow the image to zoom out if functionality gets disabled
						// when it's in a zoomed state
						if(o.disabled) { return false; }

 						$parentPane.add( $zoomParent ).addClass( lockZoomClass );
 						lockedZoom = true;
 						$zoomContain.attr( "tabindex", "0" );
 						$zoomContain[ 0 ].focus();
 					}
 					else {
 						$parentPane.add( $zoomParent ).removeClass( lockZoomClass );
 						lockedZoom = false;
 						$zoomContain.removeAttr( "tabindex" );
 					}
 				}

 				function imgZoomWidth(){
 					return $parentPane[0].offsetWidth * o.magnification;
 				}

 				// toggle magnification of image
 				function toggleImgZoom(){
 					if( zoomed ){
						// NOTE we allow the image to zoom out if functionality gets disabled
						// when it's in a zoomed state
						if(o.disabled) { return false; }

 						if( o.placement === "inline" ){
 							$contain.add( $parentPane ).css( { "width": $parentPane[0].offsetWidth + "px", "height": parseFloat( getComputedStyle( $parentPane[0] ).height ) + "px" } );
 						}
 						$zoomParent.addClass( zoomClass );
 						$( targetImg ).css( "width", imgZoomWidth() + "px" );

 						$(self).trigger( pluginName + ".after-zoom-in");
 					}
 					else{
 						$zoomParent.removeClass( zoomClass );
 						if( o.placement === "inline" ){
 							$contain.add( $parentPane ).css( { "width": "", "height": "" } );
 						}
 						$( targetImg ).css( "width", "" );

 						$(self).trigger( pluginName + ".after-zoom-out");
 					}
 				}

 				function forceInlineMode(){
 					var oldO = o.placement;
 					if( oldO !== "inline" ){
 						function resetPlacement(){
 							o.placement = oldO;
 							updatePlacement();
 							$(self).unbind( pluginName + ".after-zoom-out", resetPlacement );
 						}
 						$(self).bind( pluginName + ".after-zoom-out", resetPlacement );
 						o.placement = "inline";
 						updatePlacement();
 					}
 				}

 				// lock zoom mode toggle
 				function standardToggleZoom(){
					// NOTE if the current is zoomed out and it's disabled prevent toggling
					if(o.disabled && !zoomed) { return false; }

 					toggleZoomState();
 					toggleImgSrc();
 					toggleImgZoom();
 					scrollToCenter();
 					toggleLockZoom();
 				}

 				var trackingOn;
 				var trackingTimer;
 				var mouseEntered;
 				var touchStarted;
 				var hoverEnabled = o.hoverZoomWithoutClick;

 				// mouseenter or touchstart handler for dragging image
 				function startTrackingDelay(e){
 						if( e.type === "touchstart" ){
 							touchStarted = true;
 						}
 						if( touchStarted && e.type === "mouseenter" ||
 						 	e.type === "mouseenter" && !touchStarted && !hoverEnabled ||
 							lockedZoom ||
 							mouseEntered ){
 							return;
 						}
 						mouseEntered = true;
 						$contain.addClass( delayClass );
 						trackingTimer = setTimeout( function(){
 							$contain.removeClass( delayClass );
 							toggleZoomState();
 							toggleImgZoom();
 							toggleImgSrc();
 							trackingOn = true;
 							scrollWithMouse(e);

 						}, o.delay );
 				}

 				// mouseleave or touchend after a drag
 				function stopTrackingDelay( e ){
 						$contain.removeClass( delayClass );
 						clearTimeout( trackingTimer );
 						trackingOn = false;
 						if( o.hoverZoomWithoutClick === false && !touchStarted ){
 							hoverEnabled = false;
 						}
 						if( touchStarted && e.type === "mouseleave" ){
 							touchStarted = false;
 						}
 				}

 				// mousemove or touch-drag image placement
 				function scrollWithMouse( e ){
 						// if tracking's not on yet, ignore. This allows the delay to work
 						if( trackingOn ){
 							// if the move was touch-started, and the event is mousemove, it can be ignored
 							// (mouse events fire along with touch events and we just want the touch)
 							if( touchStarted && e.type === "mousemove" ){
 								return;
 							}
 							// normalize ev to touch or mouse
 							var ev = e.touches ? e.touches[ 0 ] : e;
 							e.preventDefault();
 							var x = ev.clientX - $contain[ 0 ].getBoundingClientRect().left;
 							var y = ev.clientY - $contain[ 0 ].getBoundingClientRect().top;

 							if( o.placement.match( /loupe/ ) ) {
 								// offset the loupe a little differently for touch so that it's not directly beneath a finger
 								var mLeft = ( e.touches ? -o.flyout.width / 1.3 : -o.flyout.width / 2 ) + "px";
 								var mTop = ( e.touches ? -o.flyout.height / 1.3 : -o.flyout.height / 2 ) + "px";
 								requestAnimationFrame(function(){
 									$flyout.css( {
 										top: y + "px",
 										left: x + "px",
 										"margin-left": mLeft,
 										"margin-top": mTop
 									} );
 								});
 							}

 							var containWidth = $contain[ 0 ].offsetWidth;
 							var containHeight = $contain[ 0 ].offsetHeight;
 							var containScrollWidth =	targetImg.offsetWidth;
 							var containScrollHeight = targetImg.offsetHeight;
 							var zoomContainWidth = $zoomContain[ 0 ].offsetWidth;
 							var zoomContainHeight = $zoomContain[ 0 ].offsetHeight;
 							var widthFactor = containWidth / zoomContainWidth;
 							var heightFactor = containWidth / zoomContainHeight;

 							$zoomContain[ 0 ].scrollLeft = (( x / containWidth ) * ( containScrollWidth - zoomContainWidth ));
 							$zoomContain[ 0 ].scrollTop = (( y / containHeight ) * ( containScrollHeight - zoomContainHeight )) ;
 						}
 				}

 				// add flyout for flyout and loupe modes
 				// flyout is always present, yet hidden when inline mode is active
 				var $flyout = $( '<div class="enlarge_flyout"></div>' ).append( $contain.clone() );
 				$flyout.insertAfter( $parentPane );

 				// add loader div
 				addLoader();
 				updatePlacement();
 				positionFlyout();

 				// clicking the magnify anchor toggles lock-zoom mode
 				$anchor
 					.bind( "keydown", function(e){
 						if( e.keyCode === 13 || e.keyCode === 32 ){
 							forceInlineMode();
 						}
 						// spacebar triggers click too
 						if( e.keyCode === 32 ){
 							e.preventDefault(); // don't scroll the new focused area
 							$( this ).trigger( "click" );
 						}
 					})
 					.bind( "click", function( e ){
 						e.preventDefault();
 						standardToggleZoom();
 					});

 				// on resize, if in lock zoom mode, un zoom
 				$( w )
 					.bind( "resize", function( e ){
 						if( lockedZoom ){
 							standardToggleZoom();
 						}
 					});

 				// on click-out on the page, if in locked zoom mode, zoom out
 				$( w.document )
 					.bind( "mouseup", function( e ){
 						if( lockedZoom && !$( e.target ).closest( $parentPane ).length ){
 							standardToggleZoom();
 						}
 					});

 				// mouse hover and touch-drag gestures for a cursor-tracked zoom behavior
 				$( initialImg )
 					.bind( "mouseenter touchstart", startTrackingDelay )
 					.bind( "mousemove touchmove", scrollWithMouse )
 					.bind( "mouseleave touchend", function( e ){
 						mouseEntered = false;
 						if( zoomed && !lockedZoom ){
 							toggleZoomState();
 							toggleImgSrc();
 							toggleImgZoom();
 						}
 						stopTrackingDelay( e );
 					})
 					// tapping the image should trigger a lock zoom
 					// click will not fire after a touch-drag so it works as a tap for our needs here
 					.bind( "click", function( e ){
 						e.preventDefault();
 						// if the click was started with a touchstart event,
 						// and placement is inline
 						// toggle the locked zoom mode
 						if( touchStarted && o.placement === "inline" ){
 							standardToggleZoom();
 						}

 						if( o.hoverZoomWithoutClick === false && !touchStarted ){
 							hoverEnabled = !hoverEnabled;
 							if( hoverEnabled ){
 								$( this ).trigger( "mouseenter" );
 							}
 							else {
 								$( this ).trigger( "mouseleave" );
 							}
 						}
 					} );

 				// keyboard handling for arrows in zoom mode
 				$(this).bind( "keydown keyup", function( e ){
 					if( e.keyCode === 37 ||
 					 		e.keyCode === 38 ||
 							e.keyCode === 39 ||
 							e.keyCode === 40 ){
 								e.stopImmediatePropagation();
 								if( !lockedZoom ){
 									e.preventDefault();
 								}
 					} else if( e.type === "keyup" && lockedZoom && e.keyCode === 27 ){ //esc or backspace closes zoom
 						standardToggleZoom();
 						$anchor[0].focus();
 						e.stopImmediatePropagation();
 					}
 				} );

 				// on scroll, zoom out
 				$parentPane.bind( "scroll", function(){
 					if( zoomed ){
 						toggleZoomState();
 						toggleImgSrc();
 						toggleImgZoom();
 					}
 					if( lockedZoom ){
 						toggleLockZoom();
 					}
 				});
 			});

 			return internalResult !== undefined ? internalResult : result;
 		};
 	};

 	if( typeof module !== "undefined" ){
 		module.exports = enlarge;
 	} else {
		enlarge();
 	}
 }( typeof global !== "undefined" ? global : this ));