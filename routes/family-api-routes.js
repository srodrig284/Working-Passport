// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app,  passport) {

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    // process the signup form
    app.post('/api/family/create', isLoggedIn, function(req, res) {
        console.log('create family');
        db.Family.create({
            name: req.body.famname,
            secret_key: req.body.secretKey,
            PersonId: req.body.personId
        }).then(function (dbFamily) {
            console.log('Successfully created family');
            // update personfamily table
            db.Personfamily.create({
                PersonId: req.body.personId,
                FamilyId: dbFamily.id
            }).then(function (dbPersonfamily) {
                console.log('Successfully created personfamily');
            }).catch(function (error) {
                console.log("Error Message = ", error);
                return done(null, false, req.flash("createPersonfamilyError", error));
            });
            res.render('chatroom.ejs', {
                familyId : dbFamily.id, // get the family id out of session and pass to template
                personId: req.body.personId
            });
        }).catch(function (error) {
            console.log("Error Message = ", error);
            return done(null, false, req.flash("createFamilyError", error));
        });
    });


    app.get('/family', isLoggedIn, function(req, res) {
        console.log('go to family');
        res.render('family.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log('isLoggedIn');
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}
