//Node Modules and Dependencies
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const http = require("http");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const server = http.createServer(app);

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

const authRouter = require("./routes/authRoutes");
const homeRouter = require("./routes/homeRoutes");
const shortenRouter = require("./routes/shortenRoutes");
const coreRoutes = require("./routes/coreRoutes");
app.use(authRouter);
app.use(homeRouter);
app.use(shortenRouter);
app.use(coreRoutes);

//3000 for localhost (127.0.0.1) and dynamic port for Heroku and other Node.JS services
const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
    console.log("App successfully spinned up on port 3000");
});