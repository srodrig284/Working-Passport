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
    app.post('/api/chatroom/create', isLoggedIn, function(req, res) {
        console.log('create chat room');
        db.ChatRoom.create({
            name: req.body.crname,
            PersonId: req.body.personId,
            FamilyId: req.body.familyId
        }).then(function (dbchatroom) {
            console.log('Successfully created chatroom');
            res.render('chatpost.ejs', {
                ChatRoomId : dbchatroom.id, // get the family id out of session and pass to template
                PersonId: req.body.personId
            });
        }).catch(function (error) {
            console.log("Error Message = ", error);
            return done(null, false, req.flash("createChatRoomError", error));
        });
    });


    app.post('/api/chatpost/create', isLoggedIn, function(req, res) {
        console.log('create chat post');
        db.ChatPost.create({
            body: req.body.chatbody,
            ChatRoomId: req.body.chatroomId,
            PersonId: req.body.personId
        }).then(function (dbchatpost) {
            console.log('Successfully created chat post');
            res.render('final.ejs', {
                chatroomId : dbchatpost.ChatRoomId, // get the chat room id out of session and pass to template
                personId: dbchatpost.PersonId,
                postbody: dbchatpost.body
            });
        }).catch(function (error) {
            console.log("Error Message = ", error);
            return done(null, false, req.flash("createChatPostError", error));
        });
    });

    app.get('/chatroom', isLoggedIn, function(req, res) {
        console.log('go to chatroom create');
        res.render('chatroom.ejs');
    });

    app.get('/chatpost', isLoggedIn, function(req, res) {
        console.log('go to chatpost create');
        res.render('chatpost.ejs');
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
