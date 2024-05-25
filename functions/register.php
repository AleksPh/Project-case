<?php
require 'functions.php';


var_dump($_POST);

$serverName = "localhost"; 
$connectionOptions = array(
    "Database" => "ProjectDB", 
    "Uid" => "your_username", 
    "PWD" => "your_password"
);


$conn = sqlsrv_connect($serverName, $connectionOptions);

if ($conn === false) {
    die(print_r(sqlsrv_errors(), true));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   
    $fullname = $_POST['fullname'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Перевірка чи вже існує користувач з такою електронною поштою
    $check_sql = "SELECT * FROM users WHERE email = ?";
    $check_stmt = sqlsrv_query($conn, $check_sql, array($email));

    if ($check_stmt === false) {
        die(print_r(sqlsrv_errors(), true));
    }

    if (sqlsrv_fetch_array($check_stmt, SQLSRV_FETCH_ASSOC)) {
        echo "Користувач з такою електронною поштою вже існує";
        sqlsrv_free_stmt($check_stmt);
    } else {
        sqlsrv_free_stmt($check_stmt);

       
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO users (fullname, email, password, created_at) VALUES (?, ?, ?, GETDATE())";
        $params = array($fullname, $email, $hashed_password);

       
        $stmt = sqlsrv_query($conn, $sql, $params);

        if ($stmt === false) {
            die(print_r(sqlsrv_errors(), true));
        } else {
            echo "Реєстрація успішна";
        }

        // Закриття підготовленого запиту
        sqlsrv_free_stmt($stmt);
    }
}

// Закриття з'єднання
sqlsrv_close($conn);
?>
