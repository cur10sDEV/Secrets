// Packages
require('dotenv').config()
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const encrypt = require('mongoose-encryption')

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

//  Mongoose Encryption
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] })

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
    const userName = req.body.username
    const password = req.body.password

    const user = new User({
        username: userName,
        password: password
    })

    user.save(function(err) {
        if (!err) {
            res.render("secrets")
        } else {
            console.log(err)
        }
    })
})

app.post("/login", function(req, res) {
    const userName = req.body.username
    const password = req.body.password

    User.findOne({username: userName}, function(err, result) {
        if (!err) {

            if (result) {

                if (result.password === password) {
                    res.render("secrets")
                } else {
                    res.send("Please double check your password")
                }
                
            } else {
                res.send("Account not found please register first!")
            }
        
        } else {
            console.log(err)
            res.send("Please double check your Username")
        }
    })
})

app.listen(3000, () => console.log("Server started successfully on port 3000!"))