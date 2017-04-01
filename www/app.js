
var keyword;

var operation;

$(function(){
  operation="user";
	$("#btnSubmit").click(function(e) {
      keyword = $("#keywordInput").val();
      $.ajax({
            type: "GET",
            url: "app.php",
            data: { operation:operation, keyword:keyword }, 
            dataType: "json",
            success: function(result,status,xhr)
            {
                alert(JSON.stringify(result)); // show response from the php script.
            }
            

          });

      e.preventDefault(); // avoid to execute the actual submit of the form.

  });


});

