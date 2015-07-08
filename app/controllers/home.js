/**
 * List
 */
exports.index = function(req, res) {
  res.render('home/index.ejs', {
    layout: 'layouts/index'
  });
}
