$(document).ready(function () {
  $(".parallax").parallax();
  $('.modal').modal();
  getArticles();

  // Grabbing the articles as a json
  function getArticles() {
    $.getJSON("/articles", function (data) {
      for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'><b>" + data[i].title + "</b><br />" + data[i].summary + "<br />" + data[i].byline + "<br /><a href=" + data[i].link + ">View Article </a>" + "|" + "<a class=" + "save-article" + "> Save Article</a></p>");
      }
    });
  };

  //function for getting only saved articles
  function getSavedArticles() {
    $.getJSON("/saved", function (data) {
      for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'><b>" + data[i].title + "</b><br />" + data[i].summary + "<br />" + data[i].byline + "<br /><a href=" + data[i].link + ">View Article </a>" + "|" + "<a class=" + "delete-article" + "> Delete Article </a>" + "|" + "<a class=" + "view-comments" + "> View Comments</a></p>");
      }
    });
  };

  function clearArticles() {
    $.ajax({
      method: "DELETE",
      url: "/articles"
    })
      .then(getArticles);
    location.reload()
  }

  function scrapeArticles() {
    $.ajax({
      method: "GET",
      url: "/scrape/"
    })
      .then(getArticles);
  }

  //click button to clear articles
  $(document).on("click", "#clear-button", function () {
    clearArticles();
  });

  //click button to scrape new articles
  $(document).on("click", "#scrape-button", function () {
    // clearArticles();
    clearArticles()
    scrapeArticles();
  });

  //click button to view saved articles
  $(document).on("click", "#view-saved-button", function () {
    // window.location.href = "/saved"
    $("#articles").empty();
    $.ajax({
      method: "GET",
      url: "/saved/"
    })
      .then(getSavedArticles);

  });


  //function to save article
  $(document).on("click", ".save-article", function () {
    var thisId = $(this).parents().data()
    $("#articles").empty();
    $.ajax({
      method: "POST",
      url: "/articles/save/" + thisId.id,
    })
      .then(getArticles);
    console.log('thisId.id', thisId.id)
  });


  $(document).on("click", ".delete-article", function () {

    $("#articles").empty();
    var thisId = $(this).parents().data()
    console.log('thisId', thisId)

    $.ajax({
      method: "POST",
      url: "/articles/delete/" + thisId.id,
    })
      .then(getSavedArticles);
    console.log('thisId.id', thisId.id)
  });


  // function to view/add comments
  $(document).on("click", ".view-comments", function () {
    console.log("click is working")
    $("#comments-modal").modal();
  });



  // TO DO - adjust onclick for articles to save and add notes
  // $(document).on("click", "#save-article", function () {
  //   // Empty the notes from the note section
  //   $("#notes").empty();
  //   // Save the id from the p tag
  //   var thisId = $(this).attr("data-id");

  //   // Now make an ajax call for the Article
  //   $.ajax({
  //     method: "GET",
  //     url: "/articles/" + thisId
  //   })

  //     .then(function (data) {
  //       console.log(data);
  //       // article title
  //       $("#notes").append("<h2>" + data.title + "</h2>");
  //       // enter a new title
  //       $("#notes").append("<input id='titleinput' name='title' >");
  //       // new note
  //       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
  //       // submit button
  //       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

  //       // If there is already a note present
  //       if (data.note) {
  //         // Place the title of the note in the title input
  //         $("#titleinput").val(data.note.title);
  //         // Place the body of the note in the body textarea
  //         $("#bodyinput").val(data.note.body);
  //       }
  //     });
  // });

  // saving notes
  $(document).on("click", "#savenote", function () {
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
      .then(function (data) {

        console.log(data);

        $("#notes").empty();
      });

    // Clear out notes form
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

});
