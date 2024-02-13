<?php

// databse part

function connect_database($ServerName, $username, $password, $dbname){
    $connection = null;
    try{
        $connection = new mysqli ($ServerName, $username, $password, $dbname);
        if(mysqli_connect_errno()){ 
            echo '{"error": "Database connection failed"}';
        }
        return $connection;
    }catch(Exception){

    }
}

function get_weather_data($connection, $cityName, $date) {
    $query = "SELECT * FROM weather_data WHERE city = '$cityName' AND day_date <= '$date' ORDER BY day_date DESC LIMIT 1";
    $result = $connection->query($query);
    if ($result) {
        return $result->fetch_assoc(); // Fetch the most recent row as an associative array
    } else {
        return null;
    }
}


function insert_weather_data($connection, $cityName, $data, $date) {
    $checkQuery = "SELECT * FROM weather_data WHERE city = '$cityName' AND day_date = '$date'";
    $checkResult = $connection->query($checkQuery);
    
    $weather_condition = $connection->real_escape_string($data['weather'][0]['description']);
    $temperature = $data['main']['temp'];
    $humidity = $data['main']['humidity'];
    $wind_speed = $data['wind']['speed'];
    $pressure = $data['main']['pressure'];
    $iconcode = $data['weather'][0]['icon'];

    if ($checkResult->num_rows > 0) {
        // Update existing record
        $updateQuery = "UPDATE weather_data SET weather_condition = '$weather_condition', temperature = '$temperature', humidity = '$humidity', wind_speed = '$wind_speed', pressure = '$pressure', iconcode = '$iconcode' WHERE city = '$cityName' AND day_date = '$date'";
        return $connection->query($updateQuery);
    } else {
        // Insert new record
        $insertQuery = "INSERT INTO weather_data (city, weather_condition, temperature, humidity, wind_speed, pressure, iconcode, day_date) VALUES ('$cityName', '$weather_condition', '$temperature', '$humidity', '$wind_speed', '$pressure', '$iconcode', '$date')";
        return $connection->query($insertQuery);
    }
}





// api part

$cityName = "brisbane";
function fetch_current_data($cityName){
    try{
        $url = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q='.$cityName.'&apikey=fc29d269a2765dfcdb95c6f5b7370014';
        $response = file_get_contents($url);
        $data = json_decode($response, true);
        return $data;
        // $weather_condition = $data['weather'][0]['main'];
        // $temperature = $data['main']['temp'];
        // $humidity = $data['main']['humidity'];
        // $wind_speed = $data['wind']['speed'];
        // $pressure = $data['main']['pressure'];
        // $iconcode = $data['weather'][0]['icon'];
        // $day_date = date('l, F j, Y', $data['dt']);
      

    }
    catch(Exception){

    }
}







// main part

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$connection = connect_database("localhost", "root", "", "prototype2");

$cityName = isset($_GET["q"]) ? $_GET["q"] : "brisbane";

$today = date("Y-m-d");
$existingData = get_weather_data($connection, $cityName, $today);

if ($existingData) {
    echo json_encode($existingData);
} else {
    $newData = fetch_current_data($cityName);
    if ($newData) {
        $result = insert_weather_data($connection, $cityName, $newData, $today);
        if ($result) {
            $databaseFormatData = [
                "city" => $newData['name'],
                "day_date" => $newData['dt'],
                "temperature" => $newData["main"]["temp"],
                "humidity" => $newData["main"]["humidity"],
                "pressure" => $newData["main"]["pressure"],
                "wind_speed" => $newData["wind"]["speed"],
                "weather_condition" => $newData["weather"][0]["description"],
                "iconcode" => $newData["weather"][0]["icon"]
            ];
            echo json_encode($databaseFormatData);
        } else {
            echo '{"error": "data couldn\'t be inserted"}';
        }
    } else {
        echo '{"error": "data couldn\'t be fetched"}';
    }
}


// history part
function get_past_weather_data($connection, $cityName) {
    $query = "SELECT * FROM (
                SELECT * FROM weather_data 
                WHERE city = '$cityName' 
                ORDER BY day_date DESC 
                LIMIT 7
              ) sub 
              ORDER BY day_date ASC";
    $result = $connection->query($query);
    if ($result) {
        return $result->fetch_all(MYSQLI_ASSOC); 
    } else {
        return null;
    }
}

if (isset($_GET['last7days'])) {
    $cityName = 'brisbane'; 
    $data = get_past_weather_data($connection, $cityName);
    echo json_encode($data);
    exit;
}
