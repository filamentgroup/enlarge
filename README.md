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

## Demo
Check the demo [here](http://filamentgroup.github.io/enlarge/docs/)

## Release History
v0.1.0 - First release
