# Component Name

Description

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/filamentgroup/asplode/master/dist/asplode.min.js
[max]: https://raw.github.com/filamentgroup/asplode/master/dist/asplode.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/asplode.min.js"></script>
<script>
jQuery(function($) {
	$( document ).bind( "enhance", function(){
		$( "body" ).addClass( "enhanced" );
	});

	$( document ).trigger( "enhance" );
});
</script>
```

## Demo
Check the demo [here](http://filamentgroup.github.io/asplode/)

## Release History
v0.1.0 - First release