(function() {
	var $enlarge;

	QUnit.module("markup");

	QUnit.test("must have an anchor", function(assert){
		assert.throws(function(){
			$(".no-anchor-enlarge").enlarge();
		});
	});

	QUnit.test("must have an container", function(assert){
		assert.throws(function(){
			$(".no-contain-enlarge").enlarge();
		});
	});

	QUnit.module("exposed methods", {
		before: function(){
			$enlarge = $(".enlarge").enlarge();
		}
	});

	QUnit.test("isZoomed", function(assert){
		assert.equal($enlarge.enlarge("isZoomed"), false);
		$enlarge.enlarge("in");
		assert.equal($enlarge.enlarge("isZoomed"), true);
		$enlarge.enlarge("out");
		assert.equal($enlarge.enlarge("isZoomed"), false);
	});

	QUnit.test("in/out", function(assert){
		var done = assert.async();

		var $img = $enlarge.find( "img" );

		$enlarge.enlarge( "in" );

		// TODO events
		setTimeout(function(){
			assert.ok($img.attr("src").indexOf("large-zoomed.jpg") >=0);
			$enlarge.enlarge( "out" );
			setTimeout(function(){
				assert.ok($img.attr("src").indexOf("large-zoomed.jpg") >=0);
				done();
			},00);
		},500);
	});

	QUnit.test("updateOptions", function(assert){
		assert.equal($enlarge.enlarge("isZoomed"), false);
		$enlarge.enlarge("updateOptions", {disabled: true});
		$enlarge.enlarge("in");
		assert.equal($enlarge.enlarge("isZoomed"), false);
		$enlarge.enlarge("updateOptions", {disabled: false});
		$enlarge.enlarge("in");
		assert.equal($enlarge.enlarge("isZoomed"), true);
	});

	QUnit.module("internal methods/functionality", {
		beforeEach: function(){
			$enlarge = $(".enlarge").enlarge();
		}
	});

	QUnit.test("toggleImgZoom", function(assert){
		var done = assert.async();

		var $img = $enlarge.find("img");

		$enlarge.one("enlarge.after-zoom-in", function(){
			assert.ok($enlarge.is(".enlarge-zoomed"));
			assert.equal($enlarge.find("img").css("width"), "3000px");

			$enlarge.one("enlarge.after-zoom-out", function(){
				assert.ok(!$enlarge.is(".enlarge-zoomed"));
				$enlarge.enlarge("updateOptions", { magnification: 4 });

				$enlarge.one("enlarge.after-zoom-in", function(){
					assert.equal($enlarge.find("img").css("width"), "4000px");
					done();
				});

				$enlarge.enlarge("in");
			});

			$enlarge.enlarge("out");
		});

		$enlarge.enlarge("in");
	});

	QUnit.test("tracking delay", function(assert){
		var delay = 1000;
		var done = assert.async();
		$enlarge.enlarge( "updateOptions", {delay: delay});

		// delay - 100ms after triggering mouseenter, should not be zoomed
		setTimeout(function(){
			assert.ok(!$enlarge.is(".enlarge-zoomed"), "before tracking delay");
		}, delay - 100);

		// delay + 100ms after triggering mouseenter, should be zoomed
		setTimeout(function(){
			assert.ok($enlarge.is(".enlarge-zoomed"), "after tracking delay");
		}, delay + 100);

		// wait until the tracking delay zoom in fires
		$enlarge.one("enlarge.after-zoom-in", function(){
			setTimeout(done, 200);
		});

		assert.ok(!$enlarge.is(".enlarge-zoomed"), "before trigger");
		$enlarge.find("img").trigger("mouseenter");

		// immediately after triggering mouseenter, should not be zoomed
		assert.ok(!$enlarge.is(".enlarge-zoomed"), "after trigger");
	});

	QUnit.test("stop tracking delay", function(assert){
		var delay = 1000;
		var done = assert.async();
		$enlarge.enlarge( "updateOptions", {delay: delay});

		// delay - 100ms after triggering mouseenter, should not be zoomed
		setTimeout(function(){
			assert.ok(!$enlarge.is(".enlarge-zoomed"), "before tracking delay");
			$enlarge.find("img").trigger("mouseleave");
		}, delay / 2);

		// delay + 100ms after triggering mouseenter, should not be zoomed
		setTimeout(function(){
			assert.ok(!$enlarge.is(".enlarge-zoomed"), "after tracking delay");
			done();
		}, delay + 200);

		assert.ok(!$enlarge.is(".enlarge-zoomed"), "before trigger");
		$enlarge.find("img").trigger("mouseenter");

		// immediately after triggering mouseenter, should not be zoomed
		assert.ok(!$enlarge.is(".enlarge-zoomed"), "after trigger");
	});

	QUnit.test("esc zooms out", function(assert){
		var done = assert.async();
		$enlarge.one("enlarge.after-zoom-in", function(){
			var event = $.Event("keyup");
			event.keyCode = 27;
			assert.equal($enlarge.enlarge("isZoomed"), true);

			$enlarge.one("enlarge.after-zoom-out", function(){
				assert.equal($enlarge.enlarge("isZoomed"), false);
				done();
			});

			$enlarge.trigger(event);
		});

		$enlarge.enlarge("in");
	});

	QUnit.test("touch without drag zooms", function(assert){
		var done = assert.async();

		$enlarge.one("enlarge.after-zoom-in", function(){
			assert.equal($enlarge.enlarge("isZoomed"), true);

			$enlarge.one("enlarge.after-zoom-out", function(){
				assert.equal($enlarge.enlarge("isZoomed"), false);
				done();
			});

			$enlarge.find("img").trigger("touchstart");
			$enlarge.find("img").trigger("click");
		});

		$enlarge.find("img").trigger("touchstart");
		$enlarge.find("img").trigger("click");
	});

	QUnit.test("spacebar on link forces inline", function(assert){
		assert.expect(3);
		var done = assert.async();
		var $flyout = $enlarge.find(".enlarge_flyout");

		$enlarge.one("enlarge.after-zoom-in", function(){
			// flyout is used for zoom because it is placement "left"
			assert.ok($(document).find(".enlarge_flyout").is(".enlarge-zoomed"));

			$enlarge.one("enlarge.after-zoom-out", function(){
				// zoom back out to test forced inline

				$enlarge.one("enlarge.after-zoom-in", function(){
					// flyout is not used for zoom
					assert.ok(!$(document).find(".enlarge_flyout").is(".enlarge-zoomed"));
					assert.ok($enlarge.is(".enlarge-zoomed"));

					done();
				});

				// trigger spacebar to force inline mode
				var e = $.Event("keydown");
				e.keyCode = 32;
				$enlarge.find("a").trigger(e);
			});

			$enlarge.enlarge("out");
		});

		// force the magnifier to placement left
		$enlarge.enlarge("updateOptions", {placement: "left"});

		// zoom in
		$enlarge.enlarge("in");
	});

	QUnit.test("scrolling parent pane zooms out", function(assert){
		assert.expect(1);
		var done = assert.async();

		$enlarge.one("enlarge.after-zoom-in", function(){

			$enlarge.one("enlarge.after-zoom-out", function(){
				// zoom back out to test forced inline
				assert.equal($enlarge.enlarge("isZoomed"), false);
				done();

			});

			$enlarge.trigger("scroll");
		});

		// zoom in
		$enlarge.enlarge("in");
	});

}(jQuery));
