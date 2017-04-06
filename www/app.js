
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
                '</td><td>'+'<button type="button" class="btn btn-default" onClick="responseClickTrash(\''+type+'\',\''+id+'\',\''+imageurl+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>'+
                '</td><td>'+'<button type="button" class="btn btn-default" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                '</td></tr>';
      $("#tbFav").append(row);
    }
    $("#tbFav").append('</tbody>');
  }else{
    //alert("test");
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
    var item = {"type":type,"id":id,"url":unescape(url),"name":unescape(name)};
    localStorage.setItem(id,JSON.stringify(item));
    $(btn).html('<span class="glyphicon glyphicon-star" aria-hidden="true"   style="color:gold"> </span>');
    //alert(btn);
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
          var imageurl = result["images"][2]["source"];
          var ele = "#collapse"+index+" .panel-body";
          //alert(ele);
          $(ele).append('<img style=" width:100%; " src="'+imageurl+'"><br>');
      }

    });
}

function responseClickBack(){
  $(".detail").css("display","none");
  $(".pagingBtn").css("display","block");
  $("table").css("display","table");
  $("#btnFav").css("display","none");
  $("#btnPost").css("display","none");
  $(".albumContainer").html("");
  $(".postContainer").html("");
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
                if(localStorage.getItem(id)==null){
                    $("#btnFav").html('<span class="glyphicon glyphicon-star-empty" aria-hidden="true" ></span>');
                }else{
                    $("#btnFav").html('<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>');
                }
                $("#btnFav").css("display","inline-block");
                $("#btnPost").css("display","inline-block");
                $("#btnFav").click(function(){

                  if(localStorage.getItem(id)==null){
                    responseClickFavorite(type,id,imageurl,itemName);
                    $("#btnFav").html('<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>');
                  }else{
                    responseClickTrash(type,id,imageurl,itemName);
                    $("#btnFav").html('<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>');
                  }
                  
                });

                $("#btnPost").click(function(){
                    FB.ui({
                         app_id: '1141555312636527',
                         method: 'feed',
                         link: window.location.href,
                         picture: unescape(imageurl),
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
                    //alert(name);
                    if(albums[i]["photos"]) getPicture(i,albums[i]["photos"]["data"][0]["id"]);
                    if(albums[i]["photos"]) getPicture(i,albums[i]["photos"]["data"][1]["id"]);
                    
                    if(i==0) {
                      $(".albumContainer").append('<div class="panel panel-default"><div class="panel-heading" ><h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapse'+i+'">'+
                          name+'</a></h4></div><div id="collapse'+i+'" class="panel-collapse collapse in"><div class="panel-body">'+
                        '</div></div></div>');
                    }else{
                      $(".albumContainer").append('<div class="panel panel-default"><div class="panel-heading" ><h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapse'+i+'">'+
                          name+'</a></h4></div><div id="collapse'+i+'" class="panel-collapse collapse"><div class="panel-body">'+
                        '</div></div></div>');
                    }
                  }
                  $(".albumContainer").append('</div>');
                  
                }else{
                  //alert("No album data found");
                  $(".albumContainer").html('<div class="well well-sm" style="background-color:#FCF8E3; " >No data found.</div>');
                }

                if(result["posts"]){
                  var posts = result["posts"]["data"];
                  $(".postContainer").html('<ul class="list-group" >');
                  for(var i = 0 ; i < posts.length; i++){
                    $(".postContainer").append('<li class="list-group-item" ><div><div style=" display : inline-block; vertical-align: middle; "><image src="'+unescape(imageurl)+
                      '" width="30" height="30" /></div><div style="display:inline-block; vertical-align: middle; margin-left:15px; "><span><b>'+unescape(itemName)+
                      '</b></span><br><small>'+moment(posts[i]["created_time"]).utc().format("YYYY-MM-DD HH:mm:ss")+'</small></div></div><br><p>'+(posts[i]["message"]?posts[i]["message"]:"")+'</p></li>');
        
                  }
                  $(".postContainer").append('</ul><br>');



                }else{
                  $(".postContainer").html('<div class="well well-sm" style="background-color:#FCF8E3; " >No data found.</div>');
                }
                
            },
            error: function(error){
              $("#progressAlbums").css("display","none");
              $("#progressPosts").css("display","none");
              if(localStorage.getItem(id)==null){
                    $("#btnFav").html('<span class="glyphicon glyphicon-star-empty" aria-hidden="true" ></span>');
                }else{
                    $("#btnFav").html('<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>');
                }
                $("#btnFav").css("display","inline-block");
                $("#btnPost").css("display","inline-block");
                $("#btnFav").click(function(){

                  if(localStorage.getItem(id)==null){
                    $("#btnFav").html('<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>');
                  }else{
                    $("#btnFav").html('<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>');
                  }
                  responseClickFavorite(type,id,imageurl,itemName);
                });

                $("#btnPost").click(function(){
                    FB.ui({
                         app_id: '1141555312636527',
                         method: 'feed',
                         link: window.location.href,
                         picture: unescape(imageurl),
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

              $(".albumContainer").html('<div class="well well-sm" style="background-color:#FCF8E3; " >No data found.</div>');
              $(".postContainer").html('<div class="well well-sm" style="background-color:#FCF8E3; " >No data found.</div>');
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
                             '</td><td><button type="button" class="btn btn-default" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $(ele).append(row);
                }
                $(ele).append('</tbody>');

                if(result["paging"]["previous"]&&result["paging"]["next"]){
                  $("#"+type+" div.pagingBtn").html('<button type="button" class="btn btn-default" value="Previous" style="margin-right:20px;" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["previous"]+'\')">Previous</button>');
                  $("#"+type+" div.pagingBtn").append('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["next"]+'\')">Next</button>');
                }else if(result["paging"]["previous"]){
                  $("#"+type+" div.pagingBtn").html('<button type="button" class="btn btn-default" value="Previous" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["previous"]+'\')">Previous</button>');
                }else if(result["paging"]["next"]){
                  $("#"+type+" div.pagingBtn").html('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["next"]+'\')">Next</button>');
                }else{

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


    $('button[type="reset"]').click(function(){
      $("table").css("display","none");
      $(".pagingBtn").html("");
    });

    $("#mForm").submit(function(event) {
      event.preventDefault();
      $(".detail").css("display","none");
      $.ajax({
            type: "GET",
            url: "server/app.php",   //relative to html which incorporates this script
            data: { operation:"user", keyword:$("#keywordInput").val() }, 
            dataType: "json",
            beforeSend: function( xhr ) {
                  //$("#tbUser").css("display","none");
                  $("#progressUser").css("display","flex");
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
                             '</td><td><button type="button" class="btn btn-default" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbUser").append(row);
                }
                $("#tbUser").append('</tbody>');

                if(pageUrl) $("#user div.pagingBtn").html('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+pageUrl+'\')">Next</button>');
                
                //$('a[href="#user"]').tab('show');
                
            }

      });

      $.ajax({
            type: "GET",
            url: "server/app.php",
            data: { operation:"page", keyword:$("#keywordInput").val() }, 
            dataType: "json",
            beforeSend: function( xhr ) {
                  $("#tbPage").css("display","none");
                  $("#progressPage").css("display","flex");
            },
            success: function(result)
            {
                $("#tbPage").css("display","table");
                $("#progressPage").css("display","none");
                $("#tbPage").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $("#tbPage").append('<tbody>');
                var items= result["data"];
                var type = "page";
                var pageUrl = result["paging"]["next"];
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = localStorage.getItem(id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbPage").append(row);
                }
                $("#tbPage").append('</tbody>');
                $("#page div.pagingBtn").html('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+pageUrl+'\')">Next</button>');
            }
            

          });

      $.ajax({
            type: "GET",
            url: "server/app.php",
            data: { operation:"event", keyword:$("#keywordInput").val() }, 
            dataType: "json",
            beforeSend: function( xhr ) {
                  $("#tbEvent").css("display","none");
                  $("#progressEvent").css("display","flex");
            },
            success: function(result)
            {
                $("#tbEvent").css("display","table");
                $("#progressEvent").css("display","none");
                $("#tbEvent").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $("#tbEvent").append('<tbody>');
                var items= result["data"];
                var type = "event";
                var pageUrl = result["paging"]["next"];
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = localStorage.getItem(id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbEvent").append(row);
                }

                $("#tbEvent").append('</tbody>');
                if(pageUrl)  $("#event div.pagingBtn").html('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+pageUrl+'\')">Next</button>');
            }
            

          });

      $.ajax({
            type: "GET",
            url: "server/app.php",
            data: { operation:"place", keyword:$("#keywordInput").val(),latitude: latitude, longitude:longitude}, 
            dataType: "json",
            beforeSend: function( xhr ) {
                  $("#tbPlace").css("display","none");
                  $("#progressPlace").css("display","flex");
            },
            success: function(result)
            {
                $("#tbPlace").css("display","table");
                $("#progressPlace").css("display","none");
                $("#tbPlace").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $("#tbPlace").append('<tbody>');
                var items= result["data"];
                var type = "place";
                var pageUrl = result["paging"]["next"];
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = localStorage.getItem(id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbPlace").append(row);
                }
                $("#tbPlace").append('</tbody>');
                if(pageUrl)  $("#place div.pagingBtn").html('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+pageUrl+'\')">Next</button>');
            }
            

          });

      $.ajax({
            type: "GET",
            url: "server/app.php",
            data: { operation:"group", keyword:$("#keywordInput").val() }, 
            dataType: "json",
            beforeSend: function( xhr ) {
                  $("#tbGroup").css("display","none");
                  $("#progressGroup").css("display","flex");
            },
            success: function(result)
            {
                $("#tbGroup").css("display","table");
                $("#progressGroup").css("display","none");
                $("#tbGroup").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $("#tbGroup").append('<tbody>');
                var items= result["data"];
                var type = "group";
                var pageUrl = result["paging"]["next"];
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = localStorage.getItem(id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default" id=\"'+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbGroup").append(row);
                }

                $("#tbGroup").append('</tbody>');

                if(pageUrl) $("#group div.pagingBtn").html('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+pageUrl+'\')">Next</button>');
            }
            

          });




      
    });


  });



