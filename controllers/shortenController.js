const Next = require("../models/nextModel");
const Link = require("../models/linkModel");
const User = require("../models/userModel");
const ShortURL = require("../utils/ShortURL.js");

//Stores the generated Hash Value
var hashValue = "";

//Stores whether the Hash is Custom Alias or not.
var isAlias = false;

//Stores whether the Hash is already taken or not.
var already = false;

exports.postShorten = async function (req, res) {
    if (req.isAuthenticated()) {
        var link = req.body.link;
        var ind = link.search("://");
        if (ind === -1) {
            link = "http://" + link;
        }
        const alias = req.body.alias;
        if (alias === "") {
            already = false;
            isAlias = false;
            var id = await Next.find({});
            id = id[0].next;
            Next.updateOne({ _id: 1 }, { $set: { 'next': id + 1 } }, async function (err, results) {
                if (!err) {
                    const hash = ShortURL.encode(id);
                    console.log(hash);
                    const newLink = new Link({
                        _id: id,
                        link: link,
                        isCustom: false,
                        hash: hash,
                        clicks: 1,
                    });
                    await newLink.save();
                    hashValue = hash;
                    User.findOneAndUpdate({ _id: req.user.id }, { $push: { links: id } }, function (err) {
                        if (!err) {
                            res.redirect("/shorten");
                        }
                        else {
                            console.log(err);
                        }
                    });
                }
            });
        }
        else {
            var id = await Next.find({});
            id = id[0].next;
            Next.updateOne({ _id: 1 }, { $set: { 'next': id + 1 } }, async function (err, results) {
                if (!err) {
                    const hash = alias;
                    console.log(hash);
                    const doc = await Link.find({ hash: hash });
                    if (doc.length <= 0) {
                        already = false;
                        const newLink = new Link({
                            _id: id,
                            link: link,
                            isCustom: true,
                            hash: hash,
                            clicks: 1,
                        });
                        await newLink.save();
                        hashValue = hash;
                        isAlias = true;
                        User.findOneAndUpdate({ _id: req.user.id }, { $push: { links: id } }, function (err) {
                            if (!err) {
                                res.redirect("/shorten");
                            }
                        });
                    }
                    else {
                        already = true;
                        res.redirect("/shorten");
                        isAlias = true;
                    }
                }
            });
        }
    }
}

exports.getShorten = function (req, res) {
    //Check if the user is authenticated
    if (req.isAuthenticated()) {
        if (already) {
            res.render("shorten", {
                slink: "Alias already taken!",
            });
        }
        else if (!isAlias) {
            res.render("shorten", {
                slink: req.hostname + "/go/" + hashValue,
            });
        }
        else {
            res.render("shorten", {
                slink: req.hostname + "/i/" + hashValue,
            });
        }

    }
    else {
        //Render "login" page if user is not logged-in.
        res.redirect("/login");
    }
}

exports.getGoCustomAlias = async function (req, res) {

    const slink = req.params.slink;
    const id = ShortURL.decode(slink);
    const doc = await Link.findById(id);
    const update = { clicks: 1 + doc.clicks };
    const up = await doc.updateOne(update);
    res.redirect(307, doc.link);
}

exports.getICustomAlias = async function (req, res) {

    const slink = req.params.slink;
    var doc = await Link.find({ hash: slink });
    //console.log(doc);
    await Link.updateOne({ hash: slink }, {
        clicks: doc[0].clicks + 1
    });
    res.redirect(307, doc[0].link);
}