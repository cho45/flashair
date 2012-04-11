(function ($) {
	var last = location.hash;

	$.fn.hashchange = function (fun) {
		if (fun) {
			arguments.callee.setup.apply(this);
			return this.bind('hashchange', fun);
		} else {
			return this.trigger('hashchange');
		}
	};

	var setuped;
	$.fn.hashchange.setup = function () {
		if (setuped) return; setuped = true;
		var self = this;
		(function () {
			if (location.hash != last) {
				self.trigger('hashchange');
			}
			setTimeout(arguments.callee, 500);
		})();
	};

	$(window).hashchange(function () {
		last = location.hash;
	});
})(jQuery);
