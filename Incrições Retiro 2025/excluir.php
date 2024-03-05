<?php
include "conexao.php";

// Verificar a conexão
if ($conexao->connect_error) {
    die("Falha na conexão: " . $conexao->connect_error);
}

// Obter o ID da pessoa da solicitação POST
$idPessoa = $_POST['idPessoa'];

// Preparar e executar a consulta SQL de exclusão
$sql = "DELETE FROM retiro2025 WHERE ID_PESSOA=$idPessoa";

if ($conexao->query($sql) === TRUE) {
    echo "Registro excluído com sucesso";
} else {
    echo "Erro ao excluir registro: " . $conexao->error;
}

$conexao->close();
?>