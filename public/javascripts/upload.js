$('.upload-btn').on('click', function() {
  $('#upload-input').click();
});

$('#upload-input').on('change', function() {

  var files = $(this).get(0).files;

  if (files.length > 0) {
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    var password = $("#password").val();

    $.ajax({
      url: '/savePic?token=' + password,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: '',
      success: function(data) {
        alert('upload successful!\n' + data);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        $("div").hide();
        $("body").append("HAHAHHAHA");
      }
    });
  }
});
