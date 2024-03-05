<?php
include "conexao.php";

if ($conexao->connect_error) {
    die("Falha na conexão: " . $conexao->connect_error);
}

// Obter o ID da pessoa e o novo status da solicitação POST
$idPessoa = $_POST['idPessoa'];
$novoStatus = $_POST['status']; // 'PAGO'

// Preparar e executar a consulta SQL para verificar o status atual
$sqlStatusAtual = "SELECT SITUACAO FROM retiro2025 WHERE ID_PESSOA=$idPessoa";
$resultadoStatusAtual = $conexao->query($sqlStatusAtual);

if ($resultadoStatusAtual->num_rows > 0) {
    $row = $resultadoStatusAtual->fetch_assoc();
    $statusAtual = $row["SITUACAO"];

    // Verificar se o status atual é diferente do novo status
    if ($statusAtual !== $novoStatus) {
        // Preparar e executar a consulta SQL de atualização
        $sql = "UPDATE retiro2025 SET SITUACAO='$novoStatus' WHERE ID_PESSOA=$idPessoa";

        if ($conexao->query($sql) === TRUE) {
            echo json_encode(array("statusChanged" => true));
        } else {
            echo json_encode(array("statusChanged" => false, "error" => "Erro ao atualizar registro: " . $conexao->error));
        }
    } else {
        // O status atual é o mesmo que o novo status
        echo json_encode(array("statusChanged" => false, "error" => "O registro já está com o status $novoStatus."));
    }
} else {
    // Não foi encontrado nenhum registro com o ID fornecido
    echo json_encode(array("statusChanged" => false, "error" => "Nenhum registro encontrado com o ID $idPessoa."));
}

$conexao->close();
?>

