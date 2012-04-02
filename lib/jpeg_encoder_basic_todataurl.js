/**
 * toDataURL support by JPEGEncoder
 */
(function () {
	var encoder = new JPEGEncoder();
	var orig_toDataURL = HTMLCanvasElement.prototype.toDataURL;
	HTMLCanvasElement.prototype.toDataURL = function (type, quality) {
		var ret = orig_toDataURL.apply(this, arguments);
		if (type == 'image/jpeg' && ret.indexOf('data:image/jpeg') !== 0) {
			var data = this.getContext('2d').getImageData(0, 0, this.width, this.height);
			ret = encoder.encode(data, quality * 100);
		}
		return ret;
	};
})();
