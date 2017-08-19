//my giphy API key: 60a662cf5d774be4922ed09719bdb709
//Sorry for the confusing var names. "response" is generally overused....
//Note about my click events -- I don't know if this is the best way to deal with
//elements that have been added to the page, but it's the way that works for me now.

var topics = [];
var responseObjs = [];

//---> responseObjs template <---

// var responseObjs = [
//   {query: "sometopic",
//    responses: [responsearray]
//   }
// ];

var host = "api.giphy.com";
var path = "/v1/gifs/search";
var apikey = "60a662cf5d774be4922ed09719bdb709";
var limit = 5;

//grab the search query from giphy.
function getQuery(query, offset) {
  //search responseObjs for any with a query value matching query.
  //if it matches, save the index and
  var foundAt = 0;
  var exists = false;

  for (var i = 0; i < responseObjs.length; i++) {
    if (responseObjs[i].query == query){
      foundAt = i;
      exists = true;
    }
  }

  if (exists) {
    offset = responseObjs[foundAt].data.length;
  } else {
    offset = 0;
  }

  var queryURL = "https://"
                  +host
                  +path
                  +"?q=" + query
                  +"&api_key=" + apikey
                  +"&limit=" + limit
                  +"&offset=" + offset;

  //send off our resquest
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response){
    console.log(response);

    // save our respose in the correct place.
    var data = response.data;
    if (response.meta.status == 200) {
      if (!exists) {
        responseObjs.push( {query, data} );
      } else {
        responseObjs[foundAt].data = responseObjs[foundAt].data.concat(data); //WORKING TODO
      }
      renderQuery();
    } else {
        $("#gifs-view").append("<p class='errors'>"+response.Error+"</p>");
        setTimeout(clearErrors, 3000);
      }
  });
}

// Hit enter or click "add gif".
// Send the query to the giphy API
$("#add-gif").on("click", function(event) {
  event.preventDefault();
  var input = $("#search-input").val();
  if (input) {
    getQuery(input, 0);
    if (topics.indexOf(input) == -1) {
      addButton(input); //TODO only if the button doesn't exist yet....
      topics.push(input);
    }
    $("#search-input").val('');
  }
});

//Click topic button to display all the gifs in that topic that have been stored
//Also gets 5 more and shows them.
$(document, ".topic-button").on("click", function(event) {
  if ($(event.target).attr("class") == "topic-button") {
    event.preventDefault();
    getQuery($(event.target).attr("value"), )
  }
});

//Pause/unpause click handler
$(document, "img").on("click", function(event) {
  if ($(event.target).attr("class") == "gif") {
    togglePause($(event.target));
  }
});

//removes any element with the error class.
function clearErrors() {
  $(".errors").remove();
}

//Add a button for each new topic.
function addButton(input) {
  var newButton = $("<input>")
                  .attr("type","button")
                  .attr("value", input)
                  .attr("class", "topic-button")
                  .text(input);
  $("#topics-view").append(newButton);
}


//Pause/unpause
function togglePause(target) {
  var state = target.attr("state");

  if (state == "still") {
    target.attr("src", target.attr("data-animate"));
    target.attr("state", "animate");
  }
  else if (state == "animate") {
    target.attr("src", target.attr("data-still"));
    target.attr("state", "still");
  }
}

//creates an img element for each entry in the response data array.
function renderQuery() {
  var currentData = responseObjs[responseObjs.length-1].data;

  //only print out the last 5 of our data...
  for (var i = currentData.length - limit; i < currentData.length; i++) {
    var newimg = $("<img>")
                 .attr("class","gif")
                 .attr("src", currentData[i].images.downsized_still.url)
                 .attr("data-still", currentData[i].images.downsized_still.url)
                 .attr("data-animate", currentData[i].images.downsized.url)
                 .attr("state","still")
                 .attr("class", "gif");
    // $("#gifs-view").append($("<p>").css("color","white").text("hello world"));

    $("#gifs-view").prepend(newimg);
  }



  // currentData.forEach(function(element) {
  //     var newimg = $("<img>")
  //                  .attr("class","gif")
  //                  .attr("src", element.images.downsized_still.url)
  //                  .attr("data-still", element.images.downsized_still.url)
  //                  .attr("data-animate", element.images.downsized.url)
  //                  .attr("state","still")
  //                  .attr("class", "gif");
  //     // $("#gifs-view").append($("<p>").css("color","white").text("hello world"));
  //
  //     $("#gifs-view").prepend(newimg);
  // });
}
