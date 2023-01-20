const Link = require("../models/linkModel");

exports.getStatsPage = async function (req, res) {
    if (req.isAuthenticated()) {
        const linksArray = req.user.links;
        const linkObjects = await Link.find({ '_id': { $in: linksArray } });
        //console.log(linkObjects);
        res.render("stats", { links: linkObjects });
    }
    else {
        //Redirect to "/login" page if user is not logged-in
        res.redirect("/login");
    }
    //res.render("stats");
}