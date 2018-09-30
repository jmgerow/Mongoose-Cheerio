var db = require("../models");
//scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.nytimes.com/section/technology").then(function (response) {
      // shorthand selector for cheerio
      var $ = cheerio.load(response.data);
      var result = {};
      console.log('result', result)
      // specify target for scrape
      $("article div.story-body").each(function (i, element) {
        // object to hold results


        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(element)
          .find("h2")
          .text();
        result.summary = $(element)
          .find("p.summary")
          .text();
        result.byline = $(element)
          .find("p.byline")
          .text();
        result.link = $(element)
          .children("a")
          .attr("href");

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {

            console.log(dbArticle);
          })
          .catch(function (err) {
            return res.json(err);
          });
      });

      // If successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
    });
  });

  // Route for getting all Articles from the db
  app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.delete("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.remove({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.get("/savedarticles", function (req, res) {
    // Grab every document in the Articles collection
    db.Saved.find({})
      .then(function (dbSaved) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbSaved);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for grabbing a specific Article by ID
  app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function (dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {

    db.Note.create(req.body)
      .then(function (dbNote) {

        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

};