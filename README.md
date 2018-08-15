# Enlarge Plugin

Description

Note: early stages of maintenance. Demos, docs, tests, still being updated.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/filamentgroup/enlarge/master/dist/enlarge.min.js
[max]: https://raw.github.com/filamentgroup/enlarge/master/dist/enlarge.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/enlarge.min.js"></script>
<script>
jQuery(function($) {
	$( document ).bind( "enhance", function(){
		$( "body" ).addClass( "enhanced" );
	});

	$( document ).trigger( "enhance" );
});
</script>
```

## Options

```javascript
  {
    button: true, // display a zoom toggle button
    hoverZoomWithoutClick: true, // automatically trigger zoom without clicking, when possible
    delay: 300,
    flyout: { // dimensions for flyout and loupe style image zooms
      width: 300,
      height: 300
    },
    placement: "inline", // style of image zoom, see details below
    magnification: 3 // multiplier for magnification
  };
```

### Image zoom styles

* **inline**: Show the zoomed image in the same place and dimensions as the original image
* **flyoutloupe**: Show the zoomed image in a small window which follows the cursor/touchpoint
* **flyoutleft**: Show the zoomed image in a window to the left of the image
* **flyoutright**: Show the zoomed image in a window to the right of the image

Note, the dimensions of the flyout* styles are determined by the `flyout` option.

## Demo
Check the demo [here](http://filamentgroup.github.io/enlarge/docs/)

## Release History
v0.1.0 - First release
