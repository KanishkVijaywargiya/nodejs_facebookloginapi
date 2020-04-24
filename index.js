var express = require('express');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

var port = process.env.PORT || 3000;

passport.use(new Strategy({
    clientID: "246215619888798",
    clientSecret: "0591afcbdf2abc4506a11bffb16b03e8",
    callbackURL: "http://localhost:3000/login/facebook/return",
},
    (accessToken, refreshToken, profile, cb) => {
        return cb(null, profile);
    }
));
passport.serializeUser((user, cb) => {
    cb(null, user);
});
passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

// create a express app
var app = express();

// set view directory
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// middlewares
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'Node JS App', resave: true, saveUninitialized: true }));


// @route   -   GET  /
// @desc    -   a route to home page
// @access  -   PUBLIC
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

// @route   -   GET  /login
// @desc    -   a route to login page
// @access  -   PUBLIC
app.get('/login', (req, res) => {
    res.render('login');
});

// @route   -   GET  /login/facebook
// @desc    -   a route to facebook auth
// @access  -   PUBLIC
app.get('/login/facebook', passport.authenticate('facebook'));

// @route   -   GET  /login/facebook/callback
// @desc    -   a route to facebook auth
// @access  -   PUBLIC
app.get('/login/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

// @route   -   GET  /profile
// @desc    -   a route to profile of a user
// @access  -   PRIVATE
app.get('/profile', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
    res.render('profile', { user: req.user })
});
app.listen(port, () => console.log('Server is running at port 3000...'));