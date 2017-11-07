// app/routes.js

// load the history model
var Hist = require('./models/history');

var cookieParser = require("cookie-parser"); 
var utils    = require( '../utils' );

// expose the routes to our app with module.exports
var callback = 
module.exports = function(app) {

    // api ---------------------------------------------------------------------
    app.get('/api/hist', function(req, res) {
        var user_id = req.cookies ? req.cookies.user_id : undefined;
        // use mongoose to get all users
        Hist.
            find({user_id : user_id}).
            sort('-date').
            limit(5).
            exec(function(err, hists) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(hists); // return all hists in JSON format
        });
    });


    // create todo and send back all todos after creation
    app.post('/api/hist', function(req, res) {
        console.log(req.cookies);
        Hist.create({
            text : req.body.text,
            user_id : req.cookies.user_id,
            date : Date.now()
        }, function(err, hists) {
            if (err)
                return res.send(err);

            // get and return all the todos after you create another
            Hist.
                find({user_id : req.cookies.user_id}).
                limit(5).
                sort('-date').
                exec(function(err, hists) {

                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (err)
                    return res.send(err);

                return res.json(hists); // return all hists in JSON format
            });
        });

    });

    app.put('/api/hist/:history_id', function(req,res) {
        var user_id = req.cookies ? req.cookies.user_id : undefined;
        Hist.findOneAndUpdate({_id: req.params.history_id}, { 
            $set: { date: Date.now() } 
        }, {new: true}, function(err, hists) {
            if (err)
                return res.send(err);
            Hist.
                find({user_id : user_id}).
                limit(5).
                sort('-date').
                exec(function(err, hists) {

                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (err)
                    return res.send(err);

                return res.json(hists); // return all hists in JSON format
            });
                

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        });
    });
    // TODO: have delete option for search; that will delete the whole schema

    // delete a history
    app.delete('/api/hist/:history_id', function(req, res) {
        var user_id = req.cookies ? req.cookies.user_id : undefined;
        Hist.remove({
            _id : req.params.history_id
        }, function(err, hists) {
            if (err)
                res.send(err);

            Hist.
                find({user_id : user_id}).
                limit(5).
                sort('-date').
                exec(function(err, hists) {

                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (err)
                    res.send(err)

                res.json(hists); // return all hists in JSON format
            });
        });
    });

    app.delete('/api/hist/', function(req, res) {
        var user_id = req.cookies ? req.cookies.user_id : undefined;

        Hist.remove({
            user_id : user_id
        }, function(err, hists) {
            if (err)
                res.send(err);

            Hist.
                find({user_id : user_id}).
                limit(5).
                sort('-date').
                exec(function(err, hists) {

                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (err)
                    res.send(err)

                res.json(hists); // return all hists in JSON format
            });
        });
    });
};