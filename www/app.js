var latitude;
var longitude;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
}

function generateFav(){
  if(localStorage.length!=0){

    $("#tbFav").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Type</th><th>Favorite</th><th>Details</th></tr></thead>");
    $("#tbFav").append('<tbody>');
    for (var i = 0; i < localStorage.length; i++){
      var item = JSON.parse(localStorage.getItem(localStorage.key(i)));
      var type = item["type"];
      var id = item["id"];
      var imageurl = item["url"];
      var name = item["name"];
      var row = '<tr><th scope="row">'+(i+1)+
                '</th><td><image src="'+imageurl+
                '" width="40" height="30" /></td><td>'+name+
                '</td><td>'+type+
                '</td><td>'+'<button type="button" class="btn btn-default btn-lg" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+name+'\')" ><span class="glyphicon glyphicon-bookmark" aria-hidden="true"></span></button>'+
                '</td><td>'+'<button type="button" class="btn btn-default btn-lg" onClick="responseClickDetail(\''+id+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                '</td></tr>';
      $("#tbFav").append(row);
    }
    $("#tbFav").append('</tbody>');
  }else{
    $("#tbFav").html("");
  }
}

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}



function responseClickFavorite(type,id,url,name){
  var btn = "#"+id;
  if(localStorage.getItem(id)==null){
    //alert("not storage");
    var item = {"type":type,"id":id,"url":url,"name":name};
    localStorage.setItem(id,JSON.stringify(item));
    $(btn).html('<span class="glyphicon glyphicon-star" aria-hidden="true"></span>');
  }else{
    //alert("storage");
    localStorage.removeItem(id);
    $(btn).html('<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>');
  }
  generateFav();
}


function getPicture(index,id){
  $.ajax({
      type: "GET",
      url: "server/app.php",   //relative to html which incorporates this script
      data: { operation:"picture", id: id}, 
      dataType: "json",
      success: function(result)
      {
          var imageurl = result["images"][result["images"].length-1]["source"];
          var ele = "#collapse"+index+" .panel-body";
          //alert(ele);
          $(ele).append('<img style="display:block;max-height:100%;max-width:100%" src="'+imageurl+'">');
      }

    });
}

function responseClickDetail(id){
    $.ajax({
            type: "GET",
            url: "server/app.php",   //relative to html which incorporates this script
            data: { operation:"detail", id:id }, 
            dataType: "json",
            beforeSend: function( xhr ) {
                  $("table").css("display","none");
                  $(".detail").css("display","block");
                  $("#progressAlbums").css("display","block");
                  $("#progressPosts").css("display","block");
            },
            success: function(result)
            {
                $("#progressAlbums").css("display","none");
                $("#progressPosts").css("display","none");

                if(result["albums"]){
                  var albums = result["albums"]["data"];
                  $(".albumContainer").html('<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">');

                  for(var i = 0 ; i < albums.length; i++){

                    var name = albums[i]["name"];
                
                    getPicture(i,albums[i]["photos"]["data"][0]["id"]);
                    getPicture(i,albums[i]["photos"]["data"][1]["id"]);
                    
                    $(".albumContainer").append('<div class="panel panel-default"><div class="panel-heading" ><h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapse'+i+'">'+
                          name+'</a></h4></div><div id="collapse'+i+'" class="panel-collapse collapse"><div class="panel-body">'+
                        '</div></div></div>');
                  }
                  $(".albumContainer").append('</div>');
                }else{
                  alert("No album data found");
                  $(".albumContainer").html("<p>No data found.</p>");
                }

                if(result["posts"]){
                  var posts = result["posts"]["data"];
                  for(var i = 0 ; i < posts.length; i++){
                    
                  }

                }else{
                  $(".postContainer").html("<p>No data found.</p>");
                }
                
            }

      });
}


$(function(){

    //get the location of the current usr
    getLocation();
    
    //generate the table of favorites
    generateFav();




    $("#mForm").submit(function(event) {
      event.preventDefault();
      $.ajax({
            type: "GET",
            url: "server/app.php",   //relative to html which incorporates this script
            data: { operation:"user", keyword:$("#keywordInput").val() }, 
            dataType: "json",
            beforeSend: function( xhr ) {
                  $("#tbUser").css("display","none");
                  $("#progressUser").css("display","block");
            },
            success: function(result)
            {
                $("#tbUser").css("display","table");
                $("#progressUser").css("display","none");
                $("#tbUser").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $("#tbUser").append('<tbody>');
                var items= result["data"];
                var type = "user";
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = (localStorage.getItem(id)==null)?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default btn-lg" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+name+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default btn-lg" onClick="responseClickDetail(\''+id+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbUser").append(row);
                }
                $("#tbUser").append('</tbody>');
                $('a[href="#user"]').tab('show');
                
            }

      });

      $.ajax({
            type: "GET",
            url: "server/app.php",
            data: { operation:"page", keyword:$("#keywordInput").val() }, 
            dataType: "json",
            beforeSend: function( xhr ) {
                  $("#tbPage").css("display","none");
                  $("#progressPage").css("display","block");
            },
            success: function(result)
            {
                $("#tbPage").css("display","table");
                $("#progressPage").css("display","none");
                $("#tbPage").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $("#tbPage").append('<tbody>');
                var items= result["data"];
                var type = "page";
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = localStorage.getItem(id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default btn-lg" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+name+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default btn-lg" onClick="responseClickDetail(\''+id+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbPage").append(row);
                }
                $("#tbPage").append('</tbody>');
            }
            

          });

      $.ajax({
            type: "GET",
            url: "server/app.php",
            data: { operation:"event", keyword:$("#keywordInput").val() }, 
            dataType: "json",
            beforeSend: function( xhr ) {
                  $("#tbEvent").css("display","none");
                  $("#progressEvent").css("display","block");
            },
            success: function(result)
            {
                $("#tbEvent").css("display","table");
                $("#progressEvent").css("display","none");
                $("#tbEvent").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $("#tbEvent").append('<tbody>');
                var items= result["data"];
                var type = "event";
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = localStorage.getItem(id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default btn-lg" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+name+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default btn-lg" onClick="responseClickDetail(\''+id+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbEvent").append(row);
                }
                $("#tbEvent").append('</tbody>');
            }
            

          });

      $.ajax({
            type: "GET",
            url: "server/app.php",
            data: { operation:"place", keyword:$("#keywordInput").val(),latitude: latitude, longitude:longitude}, 
            dataType: "json",
            beforeSend: function( xhr ) {
                  $("#tbPlace").css("display","none");
                  $("#progressPlace").css("display","block");
            },
            success: function(result)
            {
                $("#tbPlace").css("display","table");
                $("#progressPlace").css("display","none");
                $("#tbPlace").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $("#tbPlace").append('<tbody>');
                var items= result["data"];
                var type = "place";
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = localStorage.getItem(id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default btn-lg" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+name+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default btn-lg" onClick="responseClickDetail(\''+id+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbPlace").append(row);
                }
                $("#tbPlace").append('</tbody>');
            }
            

          });

      $.ajax({
            type: "GET",
            url: "server/app.php",
            data: { operation:"group", keyword:$("#keywordInput").val() }, 
            dataType: "json",
            beforeSend: function( xhr ) {
                  $("#tbGroup").css("display","none");
                  $("#progressGroup").css("display","block");
            },
            success: function(result)
            {
                $("#tbGroup").css("display","table");
                $("#progressGroup").css("display","none");
                $("#tbGroup").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $("#tbGroup").append('<tbody>');
                var items= result["data"];
                var type = "group";
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = localStorage.getItem(id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default btn-lg" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+name+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default btn-lg" onClick="responseClickDetail(\''+id+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbGroup").append(row);
                }
                $("#tbGroup").append('</tbody>');
            }
            

          });




      
    });


  });



