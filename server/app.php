<?php
	require_once __DIR__ . '/php-graph-sdk-5.0.0/src/Facebook/autoload.php';
	define("ACCESS_TOKEN",'EAABnPCLHeBoBAPoDWCsJzd9yMYpNBHeyGG8PkytYZAUZB4ABbWExdrh2OoFAstBw8UqSYbMyjwbwu2gTLphZCGP5vFOf0vsVKB7jzTvPYQE4qT7Km1N1h0d2BrkE33KnpAx7ztxpTYZCUGl3R0yRiszMYJWeIbQZD');

	$fb = new Facebook\Facebook([
		  'app_id' => '113507979196442',
		  'app_secret' => '9ba1ec02deb976891cd23a3b208e4f6c',
		  'default_graph_version' => 'v2.8',
		 ]);
	
	header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');

	if(isset($_GET["operation"])){
		$operation = $_GET["operation"];
		if($operation=="picture"){
			$id = $_GET["id"];
			try {
				  // Returns a `Facebook\FacebookResponse` object
				  //$response = $fb->get('/'.$_GET["id"].'/picture', ACCESS_TOKEN);
				$response = $fb->get('/'.$id.'/?fields=images', ACCESS_TOKEN);
				} catch(Facebook\Exceptions\FacebookResponseException $e) {
				  echo 'Graph returned an error: ' . $e->getMessage();
				  exit;
				} catch(Facebook\Exceptions\FacebookSDKException $e) {
				  echo 'Facebook SDK returned an error: ' . $e->getMessage();
				  exit;
				}
			$results = $response->getDecodedBody();
			echo json_encode($results);

		}else if($operation=="detail"){
			$id = $_GET["id"];
			try {
				  // Returns a `Facebook\FacebookResponse` object
				  $response = $fb->get('/'.$id.'?fields=albums.limit(5){name,photos.limit(2){name,picture}},posts.limit(5){created_time,message}',ACCESS_TOKEN);
				} catch(Facebook\Exceptions\FacebookResponseException $e) {
				  echo 'Graph returned an error: ' . $e->getMessage();
				  exit;
				} catch(Facebook\Exceptions\FacebookSDKException $e) {
				  echo 'Facebook SDK returned an error: ' . $e->getMessage();
				  exit;
				}
				$results = $response->getDecodedBody();
				echo json_encode($results);

		}else if($operation=="user"){

			$keyword = $_GET["keyword"];
			try {
				  // Returns a `Facebook\FacebookResponse` object
				  $response = $fb->get('/search?q='.$keyword.'&type=user&fields=id,name,picture.width(700).height(700)', ACCESS_TOKEN);
				} catch(Facebook\Exceptions\FacebookResponseException $e) {
				  echo 'Graph returned an error: ' . $e->getMessage();
				  exit;
				} catch(Facebook\Exceptions\FacebookSDKException $e) {
				  echo 'Facebook SDK returned an error: ' . $e->getMessage();
				  exit;
				}
				$results = $response->getDecodedBody();
				echo json_encode($results);
		}else if($operation=="page"){
			$keyword = $_GET["keyword"];
			try {
				  // Returns a `Facebook\FacebookResponse` object
				  $response = $fb->get('/search?q='.$keyword.'&type=page&fields=id,name,picture.width(700).height(700)', ACCESS_TOKEN);
				} catch(Facebook\Exceptions\FacebookResponseException $e) {
				  echo 'Graph returned an error: ' . $e->getMessage();
				  exit;
				} catch(Facebook\Exceptions\FacebookSDKException $e) {
				  echo 'Facebook SDK returned an error: ' . $e->getMessage();
				  exit;
				}
				$results = $response->getDecodedBody();
				echo json_encode($results);
		}else if($operation=="event"){
			$keyword = $_GET["keyword"];
			try {
				  // Returns a `Facebook\FacebookResponse` object
				  $response = $fb->get('/search?q='.$keyword.'&type=event&fields=id,name,picture.width(700).height(700)', ACCESS_TOKEN);
				} catch(Facebook\Exceptions\FacebookResponseException $e) {
				  echo 'Graph returned an error: ' . $e->getMessage();
				  exit;
				} catch(Facebook\Exceptions\FacebookSDKException $e) {
				  echo 'Facebook SDK returned an error: ' . $e->getMessage();
				  exit;
				}
				$results = $response->getDecodedBody();
				echo json_encode($results);
		}else if($operation=="place"){
			$keyword = $_GET["keyword"];
			$latitude = $_GET["latitude"];
			$longitude = $_GET["longitude"];
			try {
				  // Returns a `Facebook\FacebookResponse` object
				  $response = $fb->get('/search?q='.$keyword.'&type=place&fields=id,name,picture.width(700).height(700)&center='.$latitude.','.$longitude, ACCESS_TOKEN);
				} catch(Facebook\Exceptions\FacebookResponseException $e) {
				  echo 'Graph returned an error: ' . $e->getMessage();
				  exit;
				} catch(Facebook\Exceptions\FacebookSDKException $e) {
				  echo 'Facebook SDK returned an error: ' . $e->getMessage();
				  exit;
				}
				$results = $response->getDecodedBody();
				echo json_encode($results);
		}else if($operation=="group"){
			$keyword = $_GET["keyword"];
			try {
				  // Returns a `Facebook\FacebookResponse` object
				  $response = $fb->get('/search?q='.$keyword.'&type=group&fields=id,name,picture.width(700).height(700)', ACCESS_TOKEN);
				} catch(Facebook\Exceptions\FacebookResponseException $e) {
				  echo 'Graph returned an error: ' . $e->getMessage();
				  exit;
				} catch(Facebook\Exceptions\FacebookSDKException $e) {
				  echo 'Facebook SDK returned an error: ' . $e->getMessage();
				  exit;
				}
				$results = $response->getDecodedBody();	
				echo json_encode($results);
		}

	}


?>