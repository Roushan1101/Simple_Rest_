const express = require("express");
const app = express();
const bodyPraser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/RestPractice").then(() => {
  console.log("Connecte to database !");
});

const Schema = new mongoose.Schema({
  UID: Number,
  Email: String,
});

const Courses = mongoose.model("Courses", Schema);

app.set("view engine", "ejs");
app.use(
  bodyPraser.urlencoded({
    extended: true,
  })
);

app
  .get("/", (req, res) => {
    res.render("index");
  })
  .listen(3000, () => {
    console.log("Running");
  });

app.post("/", (req, res) => {
  entry();

  async function entry() {
    var uid = req.body.UID;
    var email = req.body.email;
    var result = new Courses({
      UID: uid,
      Email: email,
    });
    Courses.exists({ UID: uid }, (err, doc) => {
      if (doc == true) {
        console.log("Can't Add");
        res.send("Can't Add uid already exist");
        return;
      } else {
        result.save();
        res.send(result);
      }
    });
  }
});

//Show file

async function fetch(callback) {
  var All = await Courses.find({ UID: { $gt: 1 } });
  callback(All);
}

app.get("/show", (req, res, callback) => {
  fetch(callback);
});
