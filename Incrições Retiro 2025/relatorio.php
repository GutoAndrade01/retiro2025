<?php
include "conexao.php";

// Verifica se a conexão foi estabelecida com sucesso
if ($conexao->connect_error) {
    die("Erro na conexão com o banco de dados: " . $conexao->connect_error);
}

$sql = "SELECT * FROM retiro2025 R
        WHERE R.NOME_PESSOA IS NOT NULL 
        AND R.IDADE IS NOT NULL 
        AND R.COZINHA_PROPRIA IS NOT NULL
        AND R.IASD IS NOT NULL
        AND R.SITUACAO IS NOT NULL";
$result = $conexao->query($sql);

// Retornar os resultados como JSON
$rows = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    echo json_encode($rows);
} else {
    echo "0 resultados";
}

// Fechar conexão
$conexao->close();
?>
