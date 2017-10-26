const passport = require('passport'); 
const mongoose = require('mongoose'); 
const User = mongoose.model('User'); 

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed Login', 
    successRedirect: '/',
    successFlash: 'You are now logged in!'
}); 

exports.logout = (req, res) => {
    req.logout(); 
    req.flash('success', 'You are now logged out'); 
    res.redirect('/'); 
};

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next(); 
        return; 
    }
    req.flash('error', 'Oops! You must be logged in to do that!'); 
    res.redirect('/login'); 
}; 

exports.forgot = async (req, res) => {
    // see if user w/ that email exists
    const user = await User.findOne({ email: req.body.email }); 
    if (!user) {
        req.flash('error', 'No account with that email exists'); 
        return res.redirect('/login'); 
    }
    // set reset tokens and expiry on their account
    // send an email with token
    // redirect to login page
}; 