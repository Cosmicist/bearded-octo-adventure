
var blog = new (require('../blogrepo').BlogRepo);

exports.index = function(req, res) {
    var entries = blog.getEntries();
    res.render('index', { title: 'Blog!', entries: entries });
};

exports.about = function(req, res) {
    res.render('about', { title: 'About' });
};

exports.entry = function(req, res) {
    var entry = blog.getEntry(req.params.slug);
    res.render('article', {title: entry.title, entry: entry});
}