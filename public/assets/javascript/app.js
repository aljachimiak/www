/* global jQuery */
;(function (window, $) { // eslint-disable-line
	var document = window.document;
	var $body = $(document.body);
	var $window = $(window);

	function initialize() {
		initStickyHeader();
	}

	function initStickyHeader() {
		var threshold = 30;
		var atTop = true;

		$window.on('scroll', function () {
			var pos = (document.documentElement && document.documentElement.scrollTop) ||
				document.body.scrollTop || 0;

			if (pos < threshold && !atTop) {
				atTop = true;
				$body.addClass('scroll-top');
			} else if (pos >= threshold && atTop) {
				atTop = false;
				$body.removeClass('scroll-top');
			}
		});
	}

	initialize();
})(window, jQuery);
