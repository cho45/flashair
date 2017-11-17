require "rubygems"
require "rake"
require "rake/clean"
require "pathname"


CLOBBER.include("recent.htm", "blog.htm", "upload.htm")

def compile(htm)
	base = Pathname.new(htm).parent
	body = File.read(htm)
	body.gsub!(%r|<script (?:type="text/javascript" )?src="([^"]+?)"></script>|) do
		file = base + $1
		"<script>#{File.read(file)}</script>"
	end
	body.gsub!(/[ \t]+/, ' ')
end

task :default => ["recent.htm", "blog.htm", "upload.htm"]

file "recent.htm" => FileList["recent/*"] do |t|
	compiled = compile("recent/recent.htm")
	File.open(t.name, "w") do |f|
		f.puts compiled
	end
end

file "blog.htm" => FileList["flashairsxom/*"] do |t|
	compiled = compile("flashairsxom/blog.htm")
	File.open(t.name, "w") do |f|
		f.puts compiled
	end
end

file "upload.htm" => FileList["upload/*"] do |t|
	compiled = compile("upload/upload.htm")
	File.open(t.name, "w") do |f|
		f.puts compiled
	end
end
