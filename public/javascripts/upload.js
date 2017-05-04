$('.upload-btn').on('click', function() {
  $('#upload-input').click();
});

$('#upload-input').on('change', function() {

  var files = $(this).get(0).files;

  if (files.length > 0) {
    // create a FormData object which will be sent as the data payload in the
    var formData = new FormData();
    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }
    var password = $("#password").val();
    var price = $("#price").val();
    var width = $("#width").val();
    var padding = $("#padding").val();
    var name = $("#name").val();

    $.ajax({
      url: '/saveSaddle?token=' + password + '&price=' + price + '&width=' + width + '&padding=' + padding + '&name=' + name,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: '',
      success: function(data) {
        window.location.reload();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert('authentication failed!');
      }
    });
  }
});


$('.delete').on('click', function() {

  var password = $("#password").val();
  var saddleId = $(this).prev().text();

  $.ajax({
    url: '/deleteSaddle?token=' + password + '&id=' + saddleId,
    type: 'POST',
    data: {},
    processData: false,
    contentType: '',
    success: function(data) {
      window.location.reload();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert('authentication failed!');
    }
  });
});
