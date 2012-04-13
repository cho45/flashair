My FlashAir files
=================

## 最新の画像を表示

 *  recent.htm

SDカードのルートディレクトリなど、適当なところにコピーする。Android, iPhone などでいい感じになるように調整済み


iPhone:

<img src="https://lh5.googleusercontent.com/-Z3qgu5W8Q8M/T3nKmeRyuvI/AAAAAAAABzk/5PW2IYXNY4c/s512/2012-04-03%252000.49.08.png"/>

iPad:

<img src="https://lh4.googleusercontent.com/-JujV74pEGMM/T3nOyEHySBI/AAAAAAAABz8/5rpJsnMUbAE/s640/2012-04-03-01.05.02.png"/>


## Markdown で書かれた .txt をブログっぽく見せるやつ

  * blog.htm

  SDカードのルートディレクトリなど、適当なところにコピーする。/blog 以下に .txt を置く。


## FlashAir エミュレータ

FlashAir の HTTPD のエミュレータ

./sdcard 以下を SD カードとみなして、動作を模倣する

 *  List.htm の配信
 *  thumnail.cgi
 *  command.cgi (未サポート)
 *  config.cgi (未サポート)

### 依存モジュール

	$ cpan Image::ExifTool
	$ cpan Plack

### 起動

	$ plackup emulator.psgi


メモ
====

 * thumnail.cgi は同時アクセスすると刺さるのでシーケンシャルにアクセスしたほうがよさそう


	"/DCIM/100DEBUG,IMG_9776.jpg,1562380,0,16503,31592"
	  ->
		/DCIM/100DEBUG
		  ディレクトリ名
		IMG_9776.jpg
		  ファイル名
		1562380
		  ファイルサイズ
		0
		  FAT 属性値
		16503
		  FAT 日付
		31592
		  FAT 時刻

	FAT 関係は http://www.geocities.co.jp/SiliconValley-PaloAlto/2038/fat.html をみたらわかる


## Copyright

 * [jQuery]( http://jquery.com/ ) MIT License
 * [JSDeferred]( http://cho45.stfuawsc.com/jsdeferred/ ) MIT License
 * [lscache]( https://github.com/pamelafox/lscache ) Apache License
 * [JavaScript JPEG Encoder]( http://www.bytestrom.eu/blog/2009/1120a_jpeg_encoder_for_javascript ) MIT License

