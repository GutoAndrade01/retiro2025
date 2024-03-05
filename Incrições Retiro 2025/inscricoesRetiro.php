<?php
include "conexao.php";
include "index.html";

$nome = $_POST['nomeComp'];
$cpf = $_POST['cpf'];
$idade = $_POST['idade'];
$estCivil = $_POST['EstadoCivil'];
$mail = $_POST['mail'];
$fone = $_POST['tel'];
$sexo = $_POST['sexo'];
$iasd = $_POST['igreja'];
$cozinha = $_POST['cozinha'];
$regime = $_POST['vegetariano'];
$situacao = "PENDENTE";
$data = date("Y-m-d H:i:s");



$sql= "INSERT INTO retiro2025 (NOME_PESSOA, CPF, IDADE, ESTADO_CIVIL, EMAIL, CONTATO, SEXO, IASD, COZINHA_PROPRIA, VEGETARIANO, SITUACAO, DATA_INSC) 
        VALUES ('$nome', '$cpf', '$idade', '$estCivil', '$mail', '$fone', '$sexo', '$iasd', '$cozinha', '$regime', '$situacao','$data')";
       if (mysqli_query($conexao, $sql)) {
        echo "<script>alert('Cadastro concluído com sucesso!!')</script>";
        echo "<script>window.location.href = 'congratulations.html';</script>";
    }
    
        //  else{
        //      echo  "<script>alert('CPF ja cadastrado!')</script>";
        //      (header('Location:Retiro2023.index,html '.$_SERVER['REQUEST_URI']));
             
        //  }
         
         mysqli_close($conexao);