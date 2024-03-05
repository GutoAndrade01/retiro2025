<?php
include "conexao.php";

// Verifica se o método da requisição é POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verifica se os parâmetros foram recebidos corretamente
    if (isset($_POST['idPessoa']) && isset($_POST['observacao'])) {
        // Recebe e limpa os parâmetros
        $idPessoa = $_POST['idPessoa'];
        $observacao = $_POST['observacao'];

        // Prepara e executa a consulta SQL para atualizar a observação
        $sql = "UPDATE retiro2025 SET OBSERVACAO=? WHERE ID_PESSOA=?";
        $stmt = $conexao->prepare($sql);
        
        // Verifica se a consulta preparada está correta
        if ($stmt === false) {
            echo json_encode(array("statusChanged" => false, "error" => "Erro na preparação da consulta: " . $conexao->error));
        } else {
            // Liga os parâmetros à consulta preparada e executa-a
            $stmt->bind_param("si", $observacao, $idPessoa);
            $stmt->execute();
            
            // Verifica se a atualização foi bem-sucedida
            if ($stmt->affected_rows > 0) {
                echo json_encode(array("statusChanged" => true));
            } else {
                echo json_encode(array("statusChanged" => false, "error" => "Nenhuma linha afetada. Provavelmente nenhum registro encontrado com o ID fornecido."));
            }
            
            // Fecha a consulta preparada
            $stmt->close();
        }
    } else {
        echo json_encode(array("statusChanged" => false, "error" => "Parâmetros ausentes na solicitação."));
    }
} else {
    echo json_encode(array("statusChanged" => false, "error" => "Método de requisição inválido. Este script só aceita requisições POST."));
}

// Fecha a conexão com o banco de dados
$conexao->close();
?>
