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

	QUnit.module("internal methods", {
		before: function(){
			$enlarge = $(".enlarge").enlarge();
		}
	});

	QUnit.test("toggleImgZoom", function(assert){
		var done = assert.async();

		var $img = $enlarge.find("img");

		$enlarge.one("enlarge.after-zoom-in", function(){
			assert.ok($enlarge.is(".enlarge-zoomed"));

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
}(jQuery));
