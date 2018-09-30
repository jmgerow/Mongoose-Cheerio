var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//model for saving articles and adding notes
var SavedSchema = new Schema({
  
  title: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },

  byline: {
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

var Saved = mongoose.model("Saved", SavedSchema);

module.exports = Saved;
