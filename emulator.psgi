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

sub locate_file {
	my ($self, $env) = @_;
	no warnings 'redefine';
	local *File::Spec::Unix::catfile = sub {
		my $class = shift;
		$self->fat_to_real(join('/', @_));
	};
	$self->SUPER::locate_file($env);
}

sub fat_to_real {
	my ($self, $path) = @_;
	return $path unless $path =~ /~/;

	my @path = split '/', $path;
	for (my $i = 0; $i < @path; $i++) {
		next unless $path[$i] =~ /~\d/;
		my $parent = join('/', @path[0..($i-1)]);
		my ($file) = grep { $path[$i] eq $_->{fat_name} } $self->fat_children($parent);
		$path[$i] = $file->basename;
	}
	join('/', @path);
}

sub real_to_fat {
	my ($self, $path) = @_;
	my @path = split '/', $path;
	for (my $i = @path - 1; $i >= 0; $i--) {
		my $parent = join('/', @path[0..($i-1)]);
		my ($name, $ext) = split /\./, $path[$i];
		if (length $name > 8) {
			my ($file) = grep { $path[$i] eq $_->basename } $self->fat_children($parent);
			$path[$i] = $file->{fat_name};
		}
	}
	join('/', @path);
}

sub fat_children {
	my ($self, $dir) = @_;
	my $names = {};

	map {
		my $t = Time::Piece->new($_->stat->ctime);

		# FAT short name
		my ($name, $ext) = split /\./, $_->basename;
		if (length $name > 8) {
			$name = substr($name, 0, 6);
			$ext  ||= '';
			$name .= '~' . ++$names->{"$name.$ext"};
		}

		$_->{fat_name} = $ext ? "$name.$ext" : $name;

		# FAT format
		$_->{fat_attribute} = 0 | ($_->is_dir ? DIRECTORY : 0);
		$_->{fat_date} = (($t->year - 1980) << 9) | ($t->mon << 5) | $t->mday;
		$_->{fat_time} = ($t->hour << 11) | ($t->min << 5) | floor($t->second / 2);

		$_;
	}
	Path::Class::Dir->new($dir)->children
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
	for my $child ($self->fat_children($file)) {
		my $dir = "/" . Path::Class::Dir->new($self->real_to_fat($child->parent))->relative($self->real_to_fat($self->root));
		$dir = "" if $dir eq "/.";

		$js .= sprintf('wlansd[%d]="%s";', $i++, join(',', $dir, $child->{fat_name}, $child->stat->size, $child->{fat_attribute}, $child->{fat_date}, $child->{fat_time})) . "\n";
	}

	my $html = Path::Class::Dir->new($self->root)->file('SD_WLAN/List.htm')->slurp;
	$html =~ s{<!--WLANSDJLST-->}{$js};

	[ 200, [ 'Content-Type' => 'text/html'], [ $html ] ];
}

Plack::App::Emulate::FlashAir->new( root => "./sdcard/" )->to_app;
