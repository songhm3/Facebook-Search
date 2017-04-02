
$(function(){
    $("#mForm").submit(function(event) {
      $.ajax({
            type: "GET",
            url: "server/app.php",
            data: { operation:"user", keyword:$("#keywordInput").val() }, 
            dataType: "json",
            success: function(result)
            {
                alert("success");
                
            },
            error: function(error){

            }

      });

      // $.ajax({
      //       type: "GET",
      //       url: "server/app.php",
      //       data: { operation:"page", keyword:keyword }, 
      //       dataType: "json",
      //       success: function(result,status,xhr)
      //       {
      //           //alert(JSON.stringify(result)); // show response from the php script.
      //       }
            

      //     });

      // $.ajax({
      //       type: "GET",
      //       url: "server/app.php",
      //       data: { operation:"event", keyword:keyword }, 
      //       dataType: "json",
      //       success: function(result,status,xhr)
      //       {
      //           //alert(JSON.stringify(result)); // show response from the php script.
      //       }
            

      //     });

      // $.ajax({
      //       type: "GET",
      //       url: "server/app.php",
      //       data: { operation:"place", keyword:keyword }, 
      //       dataType: "json",
      //       success: function(result,status,xhr)
      //       {
      //           //alert(JSON.stringify(result)); // show response from the php script.
      //       }
            

      //     });

      // $.ajax({
      //       type: "GET",
      //       url: "server/app.php",
      //       data: { operation:"group", keyword:keyword }, 
      //       dataType: "json",
      //       success: function(result,status,xhr)
      //       {
      //           //alert(JSON.stringify(result)); // show response from the php script.
      //       }
            

      //     });

      event.preventDefault();
    });


  });

