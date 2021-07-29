// Packages
require('dotenv').config()
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const saltRounds = 10

// Configs
const app = express()
app.use(bodyParser.urlencoded({extended :true}))
app.set("view engine", "ejs")
app.use(express.static("public"))

// MongoDB
mongoose.connect('mongodb://localhost:27017/usersDB', {useNewUrlParser: true, useUnifiedTopology: true})
// Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
})
// Model
const User = new mongoose.model("User", userSchema)


// Routing
app.get("/", function(req, res) {
    res.render("home")
})

app.get("/register", function(req, res) {
    res.render("register")
})

app.get("/login", function(req, res) {
    res.render("login")
})

app.post("/register", function(req, res) {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
       const user = new User({
            username: req.body.username,
            password: hash
        })

        user.save(function(err) {
            if (!err) {
                res.render("secrets")
            } else {
                console.log(err)
            }
        }) 
    });
})

app.post("/login", function(req, res) {

    User.findOne({username: req.body.username}, function(err, foundUser) {
        if (!err) {

            if (foundUser) {

                bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                    if (result === true) {   
                        res.render("secrets")
                    } else {
                        res.send("Please double check your password")
                    }
                });
            } else {
                res.send("Account not found please register first!")
            }
        
        } else {
            console.log(err)
            res.send("Please double check your entries or try again later")
        }
    })
})

app.listen(3000, () => console.log("Server started successfully on port 3000!"))