var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//model for Mongo to store article data
var ArticleSchema = new Schema({
  
  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },
  
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

//creates model with defined schema
var Article = mongoose.model("Article", ArticleSchema);


module.exports = Article;
