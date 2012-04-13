FlashAir.Blosxom = {
	base  : '/blog',
	limit : 3,

	init : function () {
		var self = this;
		self.parent = $('#entries');
		self.pager  = $('a.pager');
		self.entryTmpl = window.tmpl('entryTmpl');
		self.observePath();
	},

	observePath : function () {
		var self = this;
		$(window).hashchange(function () {
			var pq = location.hash.substring(1).split(/\?/);
			self.path = pq[0];
			self.query = self.parseQuery(pq[1] || '');
			if (!self.path) return location.hash = '/';
			self.dispatch();
		}).hashchange();
	},

	dispatch : function () {
		var self = this;
		console.log(['dispatch', self.path]);
		console.log(['page:', self.query.get('page')]);

		self.pager.hide();
		self.parent.empty();

		var files;
		if (new RegExp('^/([0-9]{4})/([0-9][0-9])/([0-9][0-9])/$').test(self.path)) {
			var year = +RegExp.$1, month = +RegExp.$2 - 1, date = +RegExp.$3; // no warnings
			files = self.getFiles(function (file) {
				return file.date.getFullYear() == year && file.date.getMonth() == month && file.date.getDate() == date;
			});
		} else
		if (new RegExp('^/([0-9]{4})/([0-9][0-9])/$').test(self.path)) {
			var year = +RegExp.$1, month = +RegExp.$2 - 1; // no warnings
			files = self.getFiles(function (file) {
				return file.date.getFullYear() == year && file.date.getMonth() == month;
			});
		} else
		if (new RegExp('^/([0-9]{4})/$').test(self.path)) {
			var year = +RegExp.$1; // no warnings;
			files = self.getFiles(function (file) {
				return file.date.getFullYear() == year;
			});
		} else
		if (new RegExp('^/$').test(self.path)) {
			var page   = +self.query.get('page') || 1;
			var offset = self.limit * (page - 1);
			files = self.getFiles().next(function (files) {
				return files.slice(offset, offset + self.limit);
			});
			self.pager.attr('href', '#' + self.path + '?page=' + (page + 1)).show();
		} else {
			files = self.getFiles(function (file) {
				return file.path == self.base + self.path;
			});
		}

		files.
			next(function (files) {
				return parallel(files.map(function (_) { return self.getEntry(_) }));
			}).
			next(function (entries) {
				if (entries && entries.length) {
					for (var i = 0, it; (it = entries[i]); i++) {
						self.parent.append(self.entryTmpl(it));
					}
				} else {
					self.parent.text('404');
					self.pager.hide();
				}
			}).
			error(function (e) {
				alert(e);
			});
	},

	getEntry : function (file) {
		var self = this;
		return $.get(file.path + '?' + new Date(), 'text').next(function (contents) {
			var lines = contents.split(/\n/);
			var title = lines.shift();
			var body  = lines.join("\n");

			file.title = title;
			file.body  = body;
			file.body_html = new Showdown.converter().makeHtml(file.body);
			file.link = '#' + file.path.replace(new RegExp('^' + self.base), '');
			return file;
		});
	},

	parseQuery : function (string) {
		var ret = {};

		var q = string.split(/[;&]/);
		for (var i = 0, len = q.length; i < len; i++) {
			var kv = q[i].split(/\=/);
			var k = kv[0];
			var v = kv[1];

			if (!ret[k]) ret[k] = [];
			ret[k].push(v);
		}

		ret.get = function (name) {
			return (this[name] || [])[0];
		};

		ret.getAll = function (name) {
			return this[name];
		};

		return ret;
	},

	getFiles : function (filter) {
		if (!filter) filter = function () { return true };
		var self = this;

		return FlashAir.API.getFiles(self.base).next(function (files) {
			var ret = [];
			for (var i = 0, it; (it = files[i]); i++) {
				if (it.ext == 'TXT' && filter(it)) ret.push(it);
			}

			return ret.sort(function (a, b) {
				return b.date.getTime() - a.date.getTime();
			});
		});
	}
};

FlashAir.Blosxom.init();
