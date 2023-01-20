

exports.getHome = function (req, res) {
    already = false;
    hash = '';
    isAlias = false;
    res.render("home");
}

exports.getContactPage = function (req, res) {
    res.render("contact");
}