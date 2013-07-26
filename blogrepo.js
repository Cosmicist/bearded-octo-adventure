exports.BlogRepo = function() {
    var md = require( "markdown" ).markdown,
        fs = require('fs'),
        dir = __dirname+'/entries'
        files = [];

    loadEntries();

    function loadEntries()
    {
        files = [];
        var _dir = fs.readdirSync(dir);

        for (var i in _dir) {
            var filename = _dir[i],
                filepath = dir+'/'+filename,
                stat = fs.statSync(filepath);

            // Skip directories
            if (stat.isDirectory()) {
                continue;
            }

            // Get file contents
            var content = fs.readFileSync(filepath).toString();
            var file = {
                slug: filename.replace('.md', ''),
                path: filepath
            };
            // Parse attrs
            file = parseAttrs(content, file);
            file.date = new Date(file.date);

            files.push(file);
        }

        // Order by date
        files.sort(function(a, b) {
            var a_ts = a.date.getTime(), b_ts = b.date.getTime();

            if (a_ts < b_ts)  {
                return 1;
            } else if (a_ts > b_ts) {
                return -1;
            }

            return 0;
        });
    }

    function parseAttrs(src, file)
    {
        if (!file) {
            file = {};
        }

        var attrs = src.split('--------')[0].split("\n");
        for (var i in attrs) {
            var line = attrs[i];
            if (line == '') continue;

            line = line.split(':');

            file[line[0]] = line[1];
        }

        return file;
    }

    this.getEntries = function()
    {
        loadEntries();
        return files;
    };

    this.getEntry = function(slug)
    {
        var file;
        for (var i in files) {
            if (files[i].slug == slug) {
                file = files[i];
            }
        }
        if (file) {
            var src = fs.readFileSync(file.path).toString().split('--------')[1],
                html = md.toHTML(src);
            
            file.content = html;
            return file;
        }
    }
};