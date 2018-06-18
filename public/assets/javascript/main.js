$.getJSON('/articles', function(data) {
  for (var i = 0; i < data.length; i++) {
      $('#articles').append('<p data-id="' + data[i]._id + '">' + '<span class="title">' + data[i].title + '</span>' + '<br>' + data[i].date + '<br><img src="' + data[i].image + '" alt="">' + '<br><a class="goBTN" href="' + data[i].link + '"' + 'target="' + "_blank" + ' " >' + "GO" + '</a>' + '</p>');
  }
});


$(document).on('click', 'p', function() {
  $('#notes').empty();
  var thisId = $(this).attr('data-id');

  $.ajax({
          method: "GET",
          url: "/articles/" + thisId,
      })
      .done(function(data) {
          console.log(data);
          $('#notes').append('<h2>' + data.title + '</h2>');
          $('#notes').append('<input id="titleinput" name="title" placeholder="Note\'s Title">');
          $('#notes').append('<textarea id="bodyinput" name="body" placeholder="Write your note here..."></textarea>');
          $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');

          if (data.note) {
              console.log(data.note);
              $('#notes').append('<button data-id="' + data.note._id + '" id="deletenote">Delete Note</button>');
              $('#titleinput').val(data.note.title);
              $('#bodyinput').val(data.note.body);
          }
      });
});

$(document).on('click', '#deletenote', function() {

  var thisId = $(this).attr('data-id');
  console.log(thisId);
  $.ajax({
          method: "POST",
          url: "/deletenote/" + thisId
      })
      .done(function() {
          $('#titleinput').val("");
          $('#bodyinput').val("");
      });

});

$(document).on('click', '#savenote', function() {

  var thisId = $(this).attr('data-id');

  $.ajax({
          method: "POST",
          url: "/articles/" + thisId,
          data: {
              title: $('#titleinput').val(),
              body: $('#bodyinput').val()
          }
      })
      .done(function(data) {
          console.log(data);
      });

});