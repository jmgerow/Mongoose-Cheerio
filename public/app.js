// Grabbing the articles as a json
$.getJSON("/articles", function(data) {
  // Loop through the articles
  for (var i = 0; i < data.length; i++) {
    // Display to article ID
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// TO DO - adjust onclick for articles to save and add notes
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    
    .then(function(data) {
      console.log(data);
      // article title
      $("#notes").append("<h2>" + data.title + "</h2>");
      // enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // new note
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // submit button
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there is already a note present
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// saving notes
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
     
      console.log(data);

      $("#notes").empty();
    });

  // Clear out notes form
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
