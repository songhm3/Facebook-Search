
//load Facebook SDK
window.fbAsyncInit = function() {
    FB.init({
      appId      : '113507979196442',
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
var phpServer = "http://fb-env.ybgricvzi9.us-west-2.elasticbeanstalk.com/index.php";


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
}
function responseClickTrash(type,id,url,name){
  localStorage.removeItem(type+id);
  //alert("remove: "+type+id);
  $("#"+type+id).html('<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>');
  generateFav();
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
  var btn = "#"+type+id;
  if(localStorage.getItem(type+id)==null){
    //alert("not storage");
    var item = {"type":type,"id":id,"url":unescape(url),"name":unescape(name)};
    localStorage.setItem(type+id,JSON.stringify(item));
    $(btn).html('<span class="glyphicon glyphicon-star" aria-hidden="true"   style="color:gold"> </span>');
    //alert(btn);
  }else{
    //alert("storage");
    localStorage.removeItem(type+id);
    $(btn).html('<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>');
  }
  generateFav();
}


function getPicture(index,id){
  $.ajax({
      type: "GET",
      url: phpServer,   //relative to html which incorporates this script
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

function showDetail(){
  $(".tab-content").css("left","100%");
  $(".detail").animate({left:'0'});
}

function hideDetail(){
  $(".tab-content").animate({left:'0'});
  $(".detail").css("left","-100%");
}

function responseClickBack(){

  hideDetail();
  $(".pagingBtn").css("display","block");
  $("#btnFav").css("display","none");
  $("#btnPost").css("display","none");
  $(".albumContainer").html("");
  $(".postContainer").html("");
}



function responseClickDetail(type,id,imageurl,itemName){

    //alert("responseClickDetail("+type+" "+id+")");
    $.ajax({
            type: "GET",
            url: phpServer,   //relative to html which incorporates this script
            data: { operation:"detail", id:id }, 
            dataType: "json",
            beforeSend: function( xhr ) {
                  showDetail();
                  $(".pagingBtn").css("display","none");
                  $("#progressAlbums").css("display","block");
                  $("#progressPosts").css("display","block");
            },
            success: function(result)
            {
                $("#progressAlbums").css("display","none");
                $("#progressPosts").css("display","none");
                if(localStorage.getItem(type+id)==null){
                    $("#btnFav").html('<span class="glyphicon glyphicon-star-empty" aria-hidden="true" ></span>');
                }else{
                    $("#btnFav").html('<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>');
                }
                $("#btnFav").css("display","inline-block");
                $("#btnPost").css("display","inline-block");
                $('#btnFav').unbind('click');
                $("#btnFav").click(function(){

                  if(localStorage.getItem(type+id)==null){
                    //alert(type+id+" is not found");
                    responseClickFavorite(type,id,imageurl,itemName);
                    $("#btnFav").html('<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>');
                  }else{
                    //alert(type+id+" is found");
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
                  $(".albumContainer").html('<div class="panel-group" id="accordion" ');

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
              if(localStorage.getItem(type+id)==null){
                    $("#btnFav").html('<span class="glyphicon glyphicon-star-empty" aria-hidden="true" ></span>');
                }else{
                    $("#btnFav").html('<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>');
                }
                $("#btnFav").css("display","inline-block");
                $("#btnPost").css("display","inline-block");
                $('#btnFav').unbind('click');
                $("#btnFav").click(function(){

                  if(localStorage.getItem(type+id)==null){
                    $("#btnFav").html('<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>');
                    responseClickFavorite(type,id,imageurl,itemName);
                  }else{
                    $("#btnFav").html('<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>');
                    responseClickTrash(type,id,imageurl,itemName);
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
                
                $(ele).html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $(ele).append('<tbody>');
                var items= result["data"];
                console.log(pageUrl);
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = (localStorage.getItem(type+id)==null)?"<span class='glyphicon glyphicon-star-empty' aria-hidden='true'></span>":'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default" id=\"'+type+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $(ele).append(row);
                }
                $(ele).append('</tbody>');

                if(result["paging"]){
                  if(result["paging"]["previous"]&&result["paging"]["next"]){
                    $("#"+type+" div.pagingBtn").html('<button type="button" class="btn btn-default" value="Previous" style="margin-right:20px;" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["previous"]+'\')">Previous</button>');
                    $("#"+type+" div.pagingBtn").append('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["next"]+'\')">Next</button>');
                  }else if(result["paging"]["previous"]){
                    $("#"+type+" div.pagingBtn").html('<button type="button" class="btn btn-default" value="Previous" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["previous"]+'\')">Previous</button>');
                  }else if(result["paging"]["next"]){
                    $("#"+type+" div.pagingBtn").html('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["next"]+'\')">Next</button>');
                  }else{
                    $("#"+type+" div.pagingBtn").html("");
                  }
                }else{
                  $("#"+type+" div.pagingBtn").html("");
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


  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    hideDetail();
  });

    $('button[type="reset"]').click(function(){
      $(".table").html("");
      $(".pagingBtn").html("");
    });

    $("#mForm").submit(function(event) {
      event.preventDefault();
      $(".detail").css("left","-100%");
      $.ajax({
            type: "GET",
            url: phpServer,   //relative to html which incorporates this script
            data: { operation:"user", keyword:$("#keywordInput").val() }, 
            dataType: "json",
            beforeSend: function( xhr ) {
               
                  $("#progressUser").css("display","flex");
            },
            success: function(result)
            {
                //alert("debug");
              
                $("#progressUser").css("display","none");
                $("#tbUser").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $("#tbUser").append('<tbody>');
                var items= result["data"];
                var type = "user";
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = (localStorage.getItem(type+id)==null)?"<span class='glyphicon glyphicon-star-empty' aria-hidden='true'></span>":'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default" id=\"'+type+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbUser").append(row);
                }
                $("#tbUser").append('</tbody>');

                if(result["paging"]&&result["paging"]["next"]) $("#user div.pagingBtn").html('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["next"]+'\')">Next</button>');
                
                //$('a[href="#user"]').tab('show');
                
            }

      });

      $.ajax({
            type: "GET",
            url: phpServer,
            data: { operation:"page", keyword:$("#keywordInput").val() }, 
            dataType: "json",
            beforeSend: function( xhr ) {
         
                  $("#progressPage").css("display","flex");
            },
            success: function(result)
            {
           
                $("#progressPage").css("display","none");
                $("#tbPage").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $("#tbPage").append('<tbody>');
                var items= result["data"];
                var type = "page";
         
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = localStorage.getItem(type+id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default" id=\"'+type+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbPage").append(row);
                }
                $("#tbPage").append('</tbody>');
                if(result["paging"]&&result["paging"]["next"]) $("#page div.pagingBtn").html('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["next"]+'\')">Next</button>');
            }
            

          });

      $.ajax({
            type: "GET",
            url: phpServer,
            data: { operation:"event", keyword:$("#keywordInput").val() }, 
            dataType: "json",
            beforeSend: function( xhr ) {
      
                  $("#progressEvent").css("display","flex");
            },
            success: function(result)
            {
        
                $("#progressEvent").css("display","none");
                $("#tbEvent").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $("#tbEvent").append('<tbody>');
                var items= result["data"];
                var type = "event";
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = localStorage.getItem(type+id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default" id=\"'+type+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbEvent").append(row);
                }

                $("#tbEvent").append('</tbody>');
                if(result["paging"]&&result["paging"]["next"])  $("#event div.pagingBtn").html('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["next"]+'\')">Next</button>');
            }
            

          });

      $.ajax({
            type: "GET",
            url: phpServer,
            data: { operation:"place", keyword:$("#keywordInput").val(),latitude: latitude, longitude:longitude}, 
            dataType: "json",
            beforeSend: function( xhr ) {
                  
                  $("#progressPlace").css("display","flex");
            },
            success: function(result)
            {
                
                $("#progressPlace").css("display","none");
                $("#tbPlace").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $("#tbPlace").append('<tbody>');
                var items= result["data"];
                var type = "place";
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = localStorage.getItem(type+id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default" id=\"'+type+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbPlace").append(row);
                }
                $("#tbPlace").append('</tbody>');
                if(result["paging"]&&result["paging"]["next"])  $("#place div.pagingBtn").html('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["next"]+'\')">Next</button>');
            },
            error: function(error){
              alert("error");
            }
            

          });

      $.ajax({
            type: "GET",
            url: phpServer,
            data: { operation:"group", keyword:$("#keywordInput").val() }, 
            dataType: "json",
            beforeSend: function( xhr ) {
                  
                  $("#progressGroup").css("display","flex");
            },
            success: function(result)
            {
               
                $("#progressGroup").css("display","none");
                $("#tbGroup").html("<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>");
                $("#tbGroup").append('<tbody>');
                var items= result["data"];
                var type = "group";
                for(var i=0 ; i < items.length; i++){
                  var imageurl = items[i]["picture"]["data"]["url"];
                  var name = items[i]["name"];
                  var id = items[i]["id"];
                  var fav = localStorage.getItem(type+id)==null?'<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>':'<span class="glyphicon glyphicon-star" aria-hidden="true" style="color:gold"></span>';
                  var row = '<tr><th scope="row">'+(i+1)+
                            '</th><td><image src="'+imageurl+
                             '" width="40" height="30" /></td><td>'+name+
                             '</td><td><button type="button" class="btn btn-default" id=\"'+type+id+'\" onClick="responseClickFavorite(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" >'+fav+'</button>'+
                             '</td><td><button type="button" class="btn btn-default" onClick="responseClickDetail(\''+type+'\',\''+id+'\',\''+escape(imageurl)+'\',\''+escape(name)+'\')" ><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
                             '</td></tr>';
                  $("#tbGroup").append(row);
                }

                $("#tbGroup").append('</tbody>');

                if(result["paging"]&&result["paging"]["next"]) $("#group div.pagingBtn").html('<button type="button" class="btn btn-default" value="Next" onClick="responseClickPaging(\''+type+'\',\''+result["paging"]["next"]+'\')">Next</button>');
            }
            

          });

    


      
    });


});



