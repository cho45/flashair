function generateShortFileName (longFileName, n) {
	const splitted = longFileName.toUpperCase().split(/\./);
	let ext  = splitted.length >= 2 ? splitted.pop().substring(0, 3) : "";
	let base = splitted.join("").replace(/[."\/\\\[\]:;=, ]/g, "");
	if (base.length > 8) {
		base = base.substring(0, 6) + "~" + (n || 1);
	}
	if (ext.length) {
		return base + "." + ext;
	} else {
		return base;
	}
}

console.log("upload.js");

const status = document.body.querySelector("#status");

const form = document.body.querySelector("form");
form.querySelector("#file").addEventListener("change", function (e) {
	const formData = new FormData(form);
	const file = formData.get("file");
	// upload.cgi does not support long file name
	const filename = generateShortFileName(file.name);
	formData.set('file', file, filename);

	status.textContent = "Uploading... short file name:" + filename;
	const req = new XMLHttpRequest();
	req.open("POST", '/upload.cgi');
	req.onload = function (e) {
		console.log(req.responseText);
		console.log('success');
		status.textContent = req.responseText;
	};
	req.onerror = function (e) {
		console.log(e);
		alert('error');
		status.textContent = e;
	};
	req.send(formData);
});
form.addEventListener("submit", function (e) {
	e.preventDefault();
});
