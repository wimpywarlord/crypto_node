var express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
var mongoose = require("mongoose");
// Nodejs encryption with CTR 
const crypto = require('crypto'); 
const algorithm = 'aes-256-cbc'; 
const key = crypto.randomBytes(32); 
const iv = crypto.randomBytes(16); 

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
    "mongodb+srv://kshitij:qwerty123@cluster0.kfjyr.mongodb.net/nascomda?retryWrites=true&w=majority",
    function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("CONNECTED TO THE DATABASE");
        }
    }
);

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
});

var user = mongoose.model("user", userSchema);

app.get("/", function (req, res) {
    res.render("form.ejs");
})

  
function encrypt(text) { 
let cipher = crypto.createCipheriv('aes-256-cbc',Buffer.from(key), iv); 
let encrypted = cipher.update(text); 
encrypted = Buffer.concat([encrypted, cipher.final()]); 
return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') }; 
} 

app.post("/", function (req, res) {

    console.log(req.body)
    var username =  encrypt(req.body.username);
    var password =  encrypt(req.body.password);
    var email = encrypt(req.body.email);
    console.log(username)
    console.log(password)
    console.log(email)

    // PUSHING DATA INTO THE DATABASE
    user.create(
        {
            username: username.encryptedData,
            password: password.encryptedData,
            email: email.encryptedData,
        },
        function (err, yolo) {
            if (err) {
                res.send("SOME ERROR OCCURRED, TRY AGAIN.")
            } else {
                res.send(`<h1> A new login is created for you ${req.body.username} <\h1>`)

            }
        }
    );
});

app.listen(process.env.PORT || 8000, function () {
    console.log("SERVER 8000 HAS STARTED");
});
