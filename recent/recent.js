FlashAir.RecentPhotos = {
	init : function () {
		var self = this;

		if (location.hash == '#nocache') lscache.flush();

		self.bindResizeEvent();
		self.load();
	},

	bindResizeEvent : function () {
		var self = this;
		var eles = $('.ui-just');
		$(window).resize(function () {
			var padding = 5;
			var itemWidth = 100 + padding;
			var row = Math.floor( ($(window).width() - padding) / itemWidth );
			eles.width(row * itemWidth);
			self.row = row;
		}).resize();
	},

	load : function () {
		var self = this;

		var list = $('#list');
		var loading = $('.loading');
		var start = 0, limit = 1;
		next(function () {
			console.log(['getRecent', start, limit ]);
			loading.show();
			return FlashAir.API.getRecent(start, start + limit).
				next(function (files) {
					if (!files.length) throw "done";
					start = start + files.length;

					for (var i = 0, it; (it = files[i]); i++) {
						var box = $(window.tmpl('listTmpl')(it));
						self.loadThumbnailImage(box);
						list.append(box);
					}
				}).
				next(function () {
					var loadNext;
					if ($(document).height() <= $(window).height() + 150) {
						/*
						 * row = 3
						 * 1, 2, 3, 6 ...
						 * row = 4
						 * 1, 3, 4, 8 ...
						 * row = 12
						 * 1, 11, 12, 24 ...
						 */
						limit = self.row - start % self.row + Math.min(self.row * Math.floor(start / self.row), self.row);
						loadNext = next();
					} else {
						// scroll event...
						limit = self.row * 2;
						loadNext = new Deferred();
						$(window).scroll(function () {
							var rest = $(document).height() - $(window).scrollTop();
							if (rest < $(window).height() + 150) {
								$(window).unbind('scroll', arguments.callee);
								loadNext.call();
							}
						});
					}
					return loadNext;
				}).
				next(arguments.callee);
		}).
		error(function (e) {
			if (e == 'done') return;
			alert(e);
		}).
		next(function () {
			loading.hide();
		});
	},

	loadThumbnailImage : function (parent) {
		parent.find('img.thumbnail[data-path]').each(function () {
			var target = this;
			var path = target.getAttribute('data-path');
			return FlashAir.API.getThumbnailURL(path, 100).next(function (url) {
				target.src = url;
			});
		});
	}
};
FlashAir.RecentPhotos.init();
