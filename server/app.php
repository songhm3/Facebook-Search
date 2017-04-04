<?php
	require_once __DIR__ . '/php-graph-sdk-5.0.0/src/Facebook/autoload.php';
	define("ACCESS_TOKEN",'EAAQOPQ7msm8BAL7ByGZACz4fZBME7r1xaMJCKYHSFuCV7z5zihDPL9ZBy5sG7hEZC597Awq2FTNxpK7K582vF9aMEu5wzALsV0EJwTDCgx3SZBf07tsP44KRfNQB9p0ykNkjlJ23miwOGEvVERKQo4OK0Kzj10ZBAZD');

	$fb = new Facebook\Facebook([
		  'app_id' => '1141555312636527',
		  'app_secret' => 'b38228f0e6105c68d025d42b0318a678',
		  'default_graph_version' => 'v2.8',
		 ]);
	header('Content-Type: application/json');

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
				  $response = $fb->get('/'.$id.'?fields=albums.limit(5){name,photos.limit(2){name,picture}},posts.limit(5){created_time}',ACCESS_TOKEN);
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