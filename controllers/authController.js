const passport = require('passport'); 
const mongoose = require('mongoose'); 
const User = mongoose.model('User'); 
const crypto = require('crypto'); 

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
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex'); 
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save(); 
    // send an email with token
    const resetURL = `http://${req.headers.host}.account/reset/${user.resetPasswordToken}`; 
    req.flash('success', `You have been emailed a password reset link. ${resetURL}`); 
    // redirect to login page
    res.redirect('/login'); 
}; 