
//load Facebook SDK
window.fbAsyncInit = function() {
    FB.init({
      appId      : '1141555312636527',
      xfbml      : true,
      version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));



var latitude;
var longitude;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
}
function responseClickTrash(type,id,url,name){
  localStorage.removeItem(id);
  generateFav();
  $("#"+id).html('<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>');
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
                '</td><td>'+'<button type="button" class="btn btn-default btn-lg" onClick="responseClickTrash(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+name+'\')" ><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>'+
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
    var item = {"type":type,"id":id,"url":url,"name":unescape(name)};
    localStorage.setItem(id,JSON.stringify(item));
    $(btn).html('<span class="glyphicon glyphicon-star" aria-hidden="true"   style="color:gold"> </span>');
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
          $(ele).append('<img style=" width:100%; " src="'+imageurl+'">');
      }

    });
}

function responseClickBack(){
  $(".detail").css("display","none");
  $(".pagingBtn").css("display","block");
  $("table").css("display","table");
  $("#btnFav").css("display","none");
  $("#btnPost").css("display","none");
}

function responseClickDetail(type,id,imageurl,itemName){
    $.ajax({
            type: "GET",
            url: "server/app.php",   //relative to html which incorporates this script
            data: { operation:"detail", id:id }, 
            dataType: "json",
            beforeSend: function( xhr ) {
                  $("table").css("display","none");
                  $(".pagingBtn").css("display","none");
                  $(".detail").css("display","block");
                  $("#progressAlbums").css("display","block");
                  $("#progressPosts").css("display","block");
            },
            success: function(result)
            {
                $("#progressAlbums").css("display","none");
                $("#progressPosts").css("display","none");
                $("#btnFav").css("display","inline-block");
                $("#btnPost").css("display","inline-block");
                $("#btnFav").click(function(){
                  if(localStorage.getItem(id)==null){
                    var item = {"type":type,"id":id,"url":imageurl,"name":unescape(itemName)};
                    localStorage.setItem(id,JSON.stringify(item));
                    //alert($("#btnFav").html());
                    $("#btnFav").html('<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>');
                    //alert($("#btnFav").html());
                    //alert("not storage");
                  }else{
                    localStorage.removeItem(id);
                    $("#btnFav").html('<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>');
                    //alert("storage");
                  }
                  generateFav();
                });

                $("#btnPost").click(function(){
                    FB.ui({
                         app_id: '1141555312636527',
                         method: 'feed',
                         link: window.location.href,
                         picture: imageurl,
                         name: unescape(itemName),
                         caption: "FB SEARCH FROM USC CSCI571",
                         }, function(response){
                         if (response && !response.error_message){
                            alert("Posted Successfully");
                         }
                         else{
                            alert("Not Posted");
                         }
                      });
                });


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
                  //alert("No album data found");
                  $(".albumContainer").html("<p>No data found.</p>");
                }

                if(result["posts"]){
                  var posts = result["posts"]["data"];
                  $(".postContainer").html('<ul class="list-group">');
                  for(var i = 0 ; i < posts.length; i++){
                    $(".postContainer").append('<li class="list-group-item" ><image src="'+imageurl+
                      '" width="30" height="40" /><div style="display:inline-block;"><span><b>'+unescape(itemName)+
                      '</b></span><br><small>'+posts[i]["created_time"]+'</small></div><br><br><p>'+posts[i]["message"]+'</p></li>');
        
                  }
                  $(".postContainer").append('</ul>');



                }else{
                  $(".postContainer").html("<p>No data found.</p>");
                }
                
            }

      });
}

function responseClickPaging(type, pageUrl){

  var ele;
  if(type=="user") ele = "#tbUser";
  else if(type=="page") ele = "#tbPage";
  else if(type=="event") ele = "#tbEvent";
  else if(type=="place") ele = "#tbPlace";
  else if(type=="group") ele = "#tbGroup";
  $.ajax({
            type: "GET",
            url: pageUrl,    
            dataType: "json",
            success: function(result)
            {
                //alert(result);
                $(ele).html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $(ele).append('<tbody>');
                var items= result["data"];

                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = (localStorage.getItem(id)==null)?"<span class='glyphicon glyphicon-star-empty' aria-hidden='true'></span>":'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default btn-lg" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default btn-lg" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $(ele).append(row);
                }
                $(ele).append('</tbody>');

                if(result["paging"]["previous"]&&result["paging"]["next"]){
                  $("#"+type+" div.pagingBtn").html('<button type="button" class="btn btn-default" value="Previous" style="margin-right:20px;" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["previous"]+'\')">Next</button>');
                  $("#"+type+" div.pagingBtn").append('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["next"]+'\')">Next</button>');
                }else if(result["paging"]["previous"]){
                  $("#"+type+" div.pagingBtn").html('<button type="button" class="btn btn-default" value="Previous" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["previous"]+'\')">Next</button>');
                }else{
                  $("#"+type+" div.pagingBtn").html('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["next"]+'\')">Next</button>');
                }
                
                
                $('a[href="#'+type+'"]').tab('show');
                
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
                var pageUrl = result["paging"]["next"];
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = (localStorage.getItem(id)==null)?"<span class='glyphicon glyphicon-star-empty' aria-hidden='true'></span>":'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default btn-lg" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default btn-lg" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbUser").append(row);
                }
                $("#tbUser").append('</tbody>');

                $("#user div.pagingBtn").html('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+pageUrl+'\')">Next</button>');
                
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
                  var fav = localStorage.getItem(id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default btn-lg" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default btn-lg" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
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
                  var fav = localStorage.getItem(id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default btn-lg" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default btn-lg" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
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
                  var fav = localStorage.getItem(id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default btn-lg" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default btn-lg" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
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
                  var fav = localStorage.getItem(id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default btn-lg" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default btn-lg" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbGroup").append(row);
                }
                $("#tbGroup").append('</tbody>');
            }
            

          });




      
    });


  });



