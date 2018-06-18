var express = require("express");
var router = express.Router();
var request = require("request");
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
var mongoose = require("mongoose");
var cheerio = require("cheerio");

var databaseUri = "mongodb://localhost/fifaScraper";

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}

var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

router.get("/", function(req, res) {
  request("https://www.fifa.com/worldcup/news/", function(
    error,
    response,
    html
  ) {
    var $ = cheerio.load(html);
    $(".d3-o-media-object").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .children("div.d3-o-media-object__body")
        .children("a")
        .text();
      result.link = $(this)
        .children("div.d3-o-media-object__body")
        .children("a")
        .attr("href");
      result.date = $(this)
        .children("div.d3-o-media-object__body")
        .children("p")
        .text();
      result.image = $(this)
        .children("figure")
        .children("a")
        .children("picture")
        .children("img")
        .attr("data-src");
      var entry = new Article(result);

      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log(doc);
        }
      });
    });
  });

  Article.find({}, function(err, data) {
    res.render("home");
  });
});

router.get("/scrape", function(req, res) {});

router.get("/articles", function(req, res) {
  Article.find({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
    }
  });
});

router.get("/articles/:id", function(req, res) {
  Article.findOne({
    _id: req.params.id
  })
    .populate("note")
    .exec(function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.json(doc);
      }
    });
});

router.post("/deletenote/:id", function(req, res) {
  console.log(req.params.id);
  Note.remove({
    _id: req.params.id
  }).exec(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
    }
  });
});

router.post("/articles/:id", function(req, res) {
  var newNote = new Note(req.body);

  newNote.save(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      Article.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          note: doc._id
        }
      ).exec(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          res.send(doc);
        }
      });
    }
  });
});

module.exports = router;
