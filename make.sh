#!/bin/sh

cat \
	./lib/jquery-1.7.2.min.js \
	./lib/jsdeferred.jquery.js \
	./lib/lscache.js \
	./lib/jpeg_encoder_basic.js \
	./lib/jpeg_encoder_basic_todataurl.js \
	./lib/tmpl.js \
	> ./lib.js

