var db = require("../models");
//scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//route to scrape new articles from source
module.exports = function (app) {
  app.get("/scrape", function (req, res) {
    //scraping from NYT/Tech
    axios.get("https://www.nytimes.com/section/technology").then(function (response) {
      var $ = cheerio.load(response.data);
      var result = {};
      console.log('result', result)
      $("article div.story-body").each(function (i, element) {
    
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

        db.Article.create(result)
        // db.Article.create(result, {unique: true})
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
    db.Article.find({ "saved": false })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // Route to clear all articles at /. Currently clearing saved articles as well... need to fix  
  app.delete("/articles", function (req, res) {
    db.Article.deleteMany({ saved: "false" })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // route for pulling any articles that show saved = true
  app.get("/saved", function (req, res) {
    db.Article.find({ "saved": true })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });

  });


  // route to save an article
  app.post("/articles/save/:id", function (req, res) {
    db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
      .exec(function (err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);
        }
      });
      
  });

  // route for deleting article  
  app.post("/articles/delete/:id", function (req, res) {
    db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
      .exec(function (err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);
        }
      });
      
  });


  // Route for grabbing a specific Article by ID
  app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
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