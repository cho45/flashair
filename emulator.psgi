#!plackup
# vim:set ft=perl:
package Plack::App::Emulate::FlashAir;
use strict;
use warnings;
use parent qw(Plack::App::File);
use Plack::Request;
use Path::Class::Dir;
use Time::Piece;
use Image::ExifTool qw(:Public);
use POSIX qw(floor);

# FAT attribute
use constant {
	READONLY  => 0b00000001,
	HIDDEN    => 0b00000010,
	VOLUME    => 0b00000100,
	DIRECTORY => 0b00001000,
	ARCHIVE   => 0b00010000,
};

my $CGI = {
	'/thumbnail.cgi' => sub {
		my ($self, $env) = @_;
		my $path = Path::Class::Dir->new($self->root)->file($env->{QUERY_STRING});
		my $data = eval { ${ ImageInfo("$path", 'ThumbnailImage')->{ThumbnailImage} } };

		if ($@) {
			[ 400, [ 'Content-Type' => 'text/plain' ], [ $@ ] ];
		} else {
			[ 200, [ 'Content-Type' => 'image/jpeg' ], [ $data ] ];
		}
	},
	'/command.cgi' => sub {
		my ($self, $env) = @_;
		my $ret = '';
		my $req = Plack::Request->new($env);
		my $op  = $req->param('op');

		$ret = {
			# File list
			100 => sub {
				"WLANSD_FILELIST\n" .
				",DCIM,0,16,16508,2777\n" .
				",SD_WLAN,0,18,16508,2660"
			},
			# Unknown
			101 => sub { '2' },
			# Unknown
			102 => sub { '1' },
			# Unknown
			103 => sub { '1607beb4bb14c1a20388020019dd5b' },
			# SSID
			104 => sub { 'flashair_emulator' },
			# Password
			105 => sub { '12345678' },
			# Master code
			106 => sub { 'a4e495185f7b' },
			# Unknown
			107 => sub { 'Accept-Language: ja,en-US;q=0.8,en;q=0.6' },
			# Version
			108 => sub { 'F24A6W3AW1.00.01' },
		}->{$op};

		[ 200, [ 'Content-Type' => 'text/plain' ], [ $ret->() ] ];
	},
	'/config.cgi' => sub {
		my ($self, $env) = @_;
		my $ret = 'SUCCESS';
		my $req = Plack::Request->new($env);
		my $op  = $req->param('MASTERCODE');
		[ 200, [ 'Content-Type' => 'text/plain' ], [ $ret ] ];
	},
};

sub call {
	my ($self, $env) = @_;
	my $handler = $CGI->{$env->{PATH_INFO}};
	$handler ? $handler->($self, $env) : $self->SUPER::call($env);
}

sub should_handle {
	my ($self, $file) = @_;
	return -d $file || -f $file;
}

sub serve_path {
	my ($self, $env, $file) = @_;
	-f $file and return $self->SUPER::serve_path($env, $file);

	my $req = Plack::Request->new($env);
	if ($req->uri !~ m{/$}) {
		return [ 301, [ 'Location' => $req->uri . '/', 'Content-Type' => 'text/plain' ], [ '' ] ];
	}

	my $js = "";
	my $i = 0;
	for my $child (Path::Class::Dir->new($file)->children) {
		my $dir = "/" . $child->parent->relative($self->root);
		$dir = "" if $dir eq "/.";

		my $t = Time::Piece->new($child->stat->ctime);

		# FAT format
		my $attribute = 0 | ($child->is_dir ? DIRECTORY : 0);
		my $date = (($t->year - 1980) << 9) | ($t->mon << 5) | $t->mday;
		my $time = ($t->hour << 11) | ($t->min << 5) | floor($t->second / 2);

		$js .= sprintf('wlansd[%d]="%s";', $i++, join(',', $dir, $child->basename, $child->stat->size, $attribute, $date, $time)) . "\n";
	}

	my $html = Path::Class::Dir->new($self->root)->file('SD_WLAN/List.htm')->slurp;
	$html =~ s{<!--WLANSDJLST-->}{$js};

	[ 200, [ 'Content-Type' => 'text/html'], [ $html ] ];
}

Plack::App::Emulate::FlashAir->new( root => "./sdcard/" )->to_app;
