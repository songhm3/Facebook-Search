function responseClickFavorite(type,id,url,name){
  

  var btn = "#"+id;
  if(localStorage.getItem(id)==null){
    //alert("not storage");
    var item = {type,id,url,name};
    localStorage.setItem(id,item);
    $(btn).html('<span class="glyphicon glyphicon-star" aria-hidden="true"></span>');
  }else{
    //alert("storage");
    localStorage.removeItem(id);
    $(btn).html('<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>');
  }
  
}

function responseClickDetail(id){

}


$(function(){
    $("#mForm").submit(function(event) {
      event.preventDefault();
      $.ajax({
            type: "GET",
            url: "server/app.php",   //relative to html which incorporates this script
            data: { operation:"user", keyword:$("#keywordInput").val() }, 
            dataType: "json",
            success: function(result)
            {

                $("#tbUser").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $("#tbUser").append('<tbody>');
                var items= result["data"];
                var type = "user";
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = localStorage.getItem(id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td>'+'<button type="button" class="btn btn-default btn-lg" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+name+'\')" >'+fav+'</button>'+
                             '</td><td>'+'<button type="button" class="btn btn-default btn-lg" onClick="responseClickDetail(\''+id+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbUser").append(row);
                }
                $("#tbUser").append('</tbody>');
                $('a[href="#user"]').tab('show');
                
            },
            error: function(error){

            }

      });

      // $.ajax({
      //       type: "GET",
      //       url: "server/app.php",
      //       data: { operation:"page", keyword:$("#keywordInput").val() }, 
      //       dataType: "json",
      //       success: function(result,status,xhr)
      //       {
      //           //alert(JSON.stringify(result)); // show response from the php script.
      //       }
            

      //     });

      // $.ajax({
      //       type: "GET",
      //       url: "server/app.php",
      //       data: { operation:"event", keyword:$("#keywordInput").val() }, 
      //       dataType: "json",
      //       success: function(result,status,xhr)
      //       {
      //           //alert(JSON.stringify(result)); // show response from the php script.
      //       }
            

      //     });

      // $.ajax({
      //       type: "GET",
      //       url: "server/app.php",
      //       data: { operation:"place", keyword:$("#keywordInput").val() }, 
      //       dataType: "json",
      //       success: function(result,status,xhr)
      //       {
      //           //alert(JSON.stringify(result)); // show response from the php script.
      //       }
            

      //     });

      // $.ajax({
      //       type: "GET",
      //       url: "server/app.php",
      //       data: { operation:"group", keyword:$("#keywordInput").val() }, 
      //       dataType: "json",
      //       success: function(result,status,xhr)
      //       {
      //           //alert(JSON.stringify(result)); // show response from the php script.
      //       }
            

      //     });

      
    });


  });



