//Node Modules and Dependencies
require("dotenv").config();
const uniqid = require('uniqid');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const http = require("http");
const app = express();
var os = require("os");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const server = http.createServer(app);

//ShortURL Logic
var ShortURL = new function () {

    var _alphabet = '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ-_',
        _base = _alphabet.length;

    this.encode = function (num) {
        var str = '';
        while (num > 0) {
            str = _alphabet.charAt(num % _base) + str;
            num = Math.floor(num / _base);
        }
        return str;
    };

    this.decode = function (str) {
        var num = 0;
        for (var i = 0; i < str.length; i++) {
            num = num * _base + _alphabet.indexOf(str.charAt(i));
        }
        return num;
    };

};

//Stores the generated Hash Value
var hashValue = "";

//Stores whether the Hash is Custom Alias or not.
var isAlias = false;

//Stores whether the Hash is already taken or not.
var already = false;

//Session & Cookie Management Plugging in
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));

//Passport (Authorization Module) Plugging in
app.use(passport.initialize());
app.use(passport.session());

/*
Mongoose Connection URL
- Use 'mongodb://127.0.0.1:27017/linkDB' for local installation of MongoDB
- Use process.env.DB_URI for MongoDB hosted on Atlas
- Define DB_URI in the .env file, where it's value has to be the connection URL provided by MongoDB Atlas Cluster.
*/
mongoose.connect(process.env.DATABASE_URL);

//User Schema for MongoDB (Mongoose)
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    googleId: String,
    links: [Number],
});

//Single Link Model Schema for MongoDB (Mongoose)
const linkSchema = new mongoose.Schema({
    _id: Number,
    link: String,
    isCustom: Boolean,
    hash: String,
    clicks: Number,
});

//Schema for next link id model
const nextSchema = new mongoose.Schema({
    _id: Number,
    next: Number,
});

//Compiling Single Link Schema into Link Model
const Link = new mongoose.model("Link", linkSchema);

//Compiling Single Next Schema into Next Model
const Next = new mongoose.model("Next", nextSchema);

//Setting the first number to be 1 (to be run for first time only)
const firstNum = new Next({
    _id: 1,
    next: 1,
});

// Saving the firstNum to database
//firstNum.save();

//Plugging in Mongoose Plugin for Passport
userSchema.plugin(passportLocalMongoose);

//Plugging in findOrCreate helper module for Mongoose to create or find user object
userSchema.plugin(findOrCreate);

//Compiling User Schema into User Model
const User = new mongoose.model("User", userSchema);

//Plugging in Passport User Creation Strategy
passport.use(User.createStrategy());

//Persisting user data into session and cookies (After successful authentication)
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//Retrieving user data from saved session and cookies
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

//Plugging in Gooogle OAuth2.0 Authentication Strategy and adding Client ID, Cliet Secret and Callback URL.
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/keepclone",
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        //Creating User object if not found already inside the database
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));

//Get request for "/" route
app.get("/", function (req, res) {
    already = false;
    hash = '';
    isAlias = false;
    res.render("home");
});

//Get request for "/shorten" route
app.get("/shorten", function (req, res) {
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
});

//Get request for "/login" route
app.get("/login", function (req, res) {
    //Check if user is authenticated
    if (req.isAuthenticated()) {
        //Redirect to "/shorten" page if user is logged-in
        res.redirect("/shorten");
    }
    else {
        //Render "login" page if user is not logged-in.
        res.render("login");
    }
});

//Get request for "/register" route
app.get("/register", function (req, res) {
    //Check if user is authenticated
    if (req.isAuthenticated()) {
        //Redirect to "/shorten" page if user is logged-in
        res.redirect("/shorten");
    }
    else {
        //Render "register" page if user is not logged-in.
        res.render("register");
    }
});

app.get("/go/:slink", async function (req, res) {

    const slink = req.params.slink;
    const id = ShortURL.decode(slink);
    const doc = await Link.findById(id);
    const update = { clicks: 1 + doc.clicks };
    const up = await doc.updateOne(update);
    res.redirect(307, doc.link);
});

app.get("/i/:slink", async function (req, res) {

    const slink = req.params.slink;
    var doc = await Link.find({ hash: slink });
    //console.log(doc);
    await Link.updateOne({ hash: slink }, {
        clicks: doc[0].clicks + 1
    });
    res.redirect(307, doc[0].link);
});

//Get request for "/logout" route
app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/");
        }
    });
});

//Get reqest for "/contact" route
app.get("/contact", function (req, res) {
    res.render("contact");
});

//Post request for "/register" route
app.post("/register", function (req, res) {
    const name = req.body.name;
    //Register a user into database
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else {
            //Saving session cookies after successful registration
            passport.authenticate("local")(req, res, function () {
                //Find and update name of the user into database (Naming is required for some options).
                User.findOneAndUpdate({ _id: req.user.id }, { $set: { name: name } }, function (err) {
                    if (!err) {
                        //Redirect to "/shorten" page after successful registration
                        res.redirect("/shorten");
                    }
                });
            });
        }
    });
});

//Post request for "/login" route
app.post("/login", async function (req, res) {
    //Create user object from the login form data
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });
    const userExist = await User.find({ username: req.body.username });
    if (userExist.length <= 0) {
        res.redirect("/register");
    }
    else {
        req.login(user, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                //If user is found in database, save the login session and redirect to "/shorten" page
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/shorten");
                });
            }
        });
    }

});

app.post("/shorten", async function (req, res) {
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
                    res.redirect("/shorten");
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
                        res.redirect("/shorten");
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
});

//3000 for localhost (127.0.0.1) and dynamic port for Heroku and other Node.JS services
const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
    console.log("App successfully spinned up on port 3000");
});