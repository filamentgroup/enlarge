# Enlarge Plugin

Description

Note: early stages of maintenance. Demos, docs, tests, still being updated.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/filamentgroup/enlarge/master/dist/enlarge.min.js
[max]: https://raw.github.com/filamentgroup/enlarge/master/dist/enlarge.js

In your web page:

```html

<!-- example markup -->
<div class="enlarge_pane_contain">
  <div class="enlarge_pane">
    <div class="enlarge inline-demo">
      <div class="enlarge_contain">
        <img src="imgs/image.jpg" srcset="imgs/image.jpg 667w, imgs/image@2x.jpg 1333w, imgs/image@3x.jpg 2000w" sizes="600px" alt="" id="test-img">
      </div>
      <a href="imgs/image.jpg" class="enlarge_btn" title="Toggle Zoom">Toggle Zoom</a>
    </div>
  </div>
</div>

<script src="jquery.js"></script>
<script src="dist/enlarge.min.js"></script>
<!-- plugin init is bound to "enhance" event on body -->
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

Set as `data` on `.enlarge` element. 

```javascript
$(".enlarge.my-zoom-image").data("options", {
    hoverZoomWithoutClick: true, // automatically trigger zoom without clicking, when possible
    delay: 300,
    flyout: { // dimensions for flyout and loupe style image zooms
      width: 300,
      height: 300
    },
    placement: "inline", // style of image zoom, see details below
    magnification: 3 // multiplier for magnification
  }
});
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
