const request = function(url, data) {
  console.log(data);
  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    processData: false,
    contentType: '',
    success: function(data) {
      window.location.reload();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert('authentication failed!');
    }
  });
};

// $('.upload-btn').on('click', function() {
//   $('#upload-input').click();
// });

// $('#upload-input').on('change', function() {

//   var files = $(this).get(0).files;

//   if (files.length > 0) {
//     // create a FormData object which will be sent as the data payload in the
//     var formData = new FormData();
//     // loop through all the selected files and add them to the formData object
//     for (var i = 0; i < files.length; i++) {
//       var file = files[i];
//       // add the files to formData object for the data payload
//       formData.append('uploads[]', file, file.name);
//     }
//     formData.token = $("#password").val();
//     formData.price = $("#price").val();
//     formData.width = $("#width").val();
//     formData.padding = $("#padding").val();
//     formData.name = $("#name").val();

//     // var url = '/saveSaddle?token=' + password + '&price=' + price + '&width=' + width + '&padding=' + padding + '&name=' + name;
//     var url = '/saveSaddle';

//     console.log(formData);

//     return request(url, formData);

//   }
// });

$('.delete').on('click', function() {
  var password = $("#password").val();
  var image = $(this).prev().text();
  var saddleId = $(this).prev().prev().text();
  var url = '/deleteSaddle?token=' + password + '&id=' + saddleId + '&image=' + image;
  var data = {};
  return request(url, data);
});
