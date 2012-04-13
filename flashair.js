Deferred.define();

var FlashAir = {};
FlashAir.API = {
	isConnected : function () {
		var d = new Deferred();
		$.ajax({
			url: '/command.cgi?op=101',
			type : "GET",
			timeout: 10 * 1000,
			dataType: 'text',
			success : function (data, status, xhr) {
				d.call(true);
			},
			error : function (jqXHR, status, error) {
				d.call(false);
			}
		});
		return d;
	},

	waitUntilConnect : function () {
		return next(function () {
			return FlashAir.API.isConnected().next(function (connected) {
				if (!connected) {
					return wait(3).next(FlashAir.API.waitUntilConnect);
				}
			});
		});
	},

	waitUntilConnectToInternet : function () {
		return next(function () {
			var d = new Deferred();
			var img = new Image();
			var timer;
			img.onload = function () {
				clearInterval(timer);
				d.call();
			};
			img.onerror = function () {
				clearInterval(timer);
				d.fail('not connected; onerror');
			};
			timer = setInterval(function () {
				img.onload = null;
				img.onerror = null;
				img = null;
				d.fail('not connected; timeout');
			}, 10 * 1000);
			img.src = "http://www.google.com/textinputassistant/tia.png?" + new Date().getTime();
			return d;
		}).
		error(function (e) {
			console.log(e);
			if (e.match(/not connected/)) {
				return wait(3).next(FlashAir.API.waitUntilConnectToInternet);
			} else {
				throw e;
			}
		});
	},

	loadAsBinary : function (path) {
		var d = new Deferred();
		$.ajax({
			url: path,
			type : "GET",
			dataType: 'text',
			beforeSend: function ( xhr ) {
				xhr.overrideMimeType("text/plain; charset=x-user-defined");
			},
			success : function (data, status, xhr) {
				var binary = '';
				for (var i = 0, len = data.length; i < len; i++) {
					binary += String.fromCharCode(data[i].charCodeAt(0) & 0xff);
				}
				d.call(binary);
			}
		});
		return d;
	},

	getFiles : function (path) {
		// console.log(['getFiles', path]);
		var d = new Deferred();
		$.ajax({
			url: path,
			type : "GET",
			dataType: 'text',
			success : function (data, status, xhr) {
				try {
					var js = data.match(/wlansd\[\d+\]=.+/g) || [];
					var files = new Function("wlansd", js.join("\n") + "return wlansd")([]);
					for (var i = 0, it; (it = files[i]); i++) files[i] = new FlashAir.File(it);
					d.call(files);
				} catch (e) { d.fail(e) }
			},
			error : function (jqXHR, status, error) {
				d.fail([jqXHR, status, error]);
			}
		});
		return d;
	},

	getRecent : function (start, end) {
		end = end || start + 1;

		if (!arguments.callee.cache) arguments.callee.cache = { directories: null, files : [] };
		var cache = arguments.callee.cache;
		// console.log(cache);

		return next(function () {
			if (!cache.directories) {
				return FlashAir.API.getFiles('/DCIM').next(function (files) {
					files.sort(function (a, b) { return a.date.getTime() - b.date.getTime() });
					var directories = [];
					for (var i = 0, it; (it = files[i]); i++) {
						if (it.isDCFDirectory && it.filename != '100__TSB') directories.push(it);
					}
					cache.directories = directories;
					return directories;
				});
			} else {
				return cache.directories;
			}
		}).
		next(function (directories) {
			var enough   = !!cache.files[end-1];
			var finished = !directories.length;
			if (enough || finished) return cache.files.slice(start, end);

			var directory = directories.pop();
			return FlashAir.API.getFiles(directory.path).next(function (files) {
				files.sort(function (a, b) { return b.date.getTime() - a.date.getTime() });
				for (var i = 0, it; (it = files[i]); i++) {
					if (it.isDCFBasicFile) cache.files.push(it);
				}
				return FlashAir.API.getRecent(start, end);
			});
		});
	},

	// require lscache
	getThumbnailURL : function (path, size) {
		var d = new Deferred();
		size = size * (window.devicePixelRatio || 1);

		var cache = lscache.get('thumbnail:' + path);
		if (!cache) {
			console.log(['create thumbnail', path]);

			if (!arguments.callee.queue) arguments.callee.queue = [];
			var queue = arguments.callee.queue;
			queue.push({ path : path, size : size, deferred : d });

			if (!queue.worker) {
				queue.worker = next(function () {
					return next(function () {
						var job  = queue.shift();
						if (!job) throw "done";
						var path = job.path;
						var size = job.size;
						var ret  = new Deferred();

						var img = new Image();
						img.onload = function () {
							try {
								var canvas = document.createElement('canvas');
								canvas.setAttribute('width', size);
								canvas.setAttribute('height', size);

								var ctx = canvas.getContext('2d');
								var source = Math.min(img.height, img.width) * 0.9;
								ctx.drawImage(img,
									(img.width  - source) / 2,
									(img.height - source) / 2,
									source,
									source,
									0,
									0,
									size,
									size
								);
								var url = canvas.toDataURL('image/jpeg', 0.8);
								console.log(['cached thumbnail/size:', url.length ]);
								lscache.set('thumbnail:' + path, url);
								job.deferred.call(url);
							} catch (e) { job.deferred.fail(e) }
							ret.call();
						};
						img.src = '/thumbnail.cgi?' + path;

						return ret;
					}).
					next(arguments.callee);
				}).
				error(function (e) {
					if (e === 'done') return delete queue.worker;
					alert(e);
				});
			}
		} else {
			// console.log(['cached thumbnail:', path]);
			next(function () { d.call(cache) });
		}

		return d;
	}
};

FlashAir.File = function () { this.init.apply(this, arguments) };
FlashAir.File.prototype = {
	init : function (data) {
		data = data.split(/,/);
		this.directory = data[0];
		this.filename  = data[1];
		this.path      = this.directory + '/' + this.filename;
		this.ext       = (this.filename.split(/\./)[1] || '').toUpperCase();
		this.size      = +data[2];
		this.attribute = +data[3];

		var d = +data[4], t = +data[5];
		this.date = new Date(
			((d & 0xfe00) >> 9) + 1980, // 1111111000000000 (origin=1980)
			((d & 0x1e0) >> 5) + 1,     // 0000000111100000 (1-12)
			d & 0x1f,                   // 0000000000011111 (1-31)
			((t & 0xf800) >> 11),       // 1111100000000000 (hour)
			((t & 0x7e0) >> 5),         // 0000011111100000 (min)
			t & 0x1f * 2                // 0000000000011111 (sec / 2)
		);

		this.isDirectory    = this.attribute & 0x08 !== 0;
		this.isFile         = !this.isDirectory;
		this.isDCFDirectory = new RegExp('^/DCIM/[0-9]{3}[0-9A-Z_]+$', 'i').test(this.path);
		this.isDCFBasicFile = new RegExp('^/DCIM/[0-9]{3}[0-9A-Z_]+/[0-9A-Z_]{4}[0-9]{4}.JPG$', 'i').test(this.path);
	}
};



