<?php
    $servidor = "gzp0u91edhmxszwf.cbetxkdyhwsb.us-east-1.rds.amazonaws.com";
    $port = "3306";
    $usuario = "zjs73l65kho5rx4y";
    $password = "xo7x07divjv7b2xy";
    $dbname = "k1mklhr2a0l71mi6";

    $conexao = mysqli_connect($servidor, $usuario, $password, $dbname);
      mysqli_set_charset($conexao, "utf8");
      if(!$conexao){
        die("Falha na conexão:".mysqli_connect_error());
     }
     
?>