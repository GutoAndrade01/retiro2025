// Defina variáveis globais para controlar a página atual e o número de registros por página
var paginaAtual = 1;
var registrosPorPagina = 100;
// Função para carregar os dados da tabela com paginação e adicionar scroll de rolagem
function carregarDadosTabela(paginaAtual, registrosPorPagina) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var dados = JSON.parse(this.responseText);
            var tabelaCorpo = document.getElementById("tabela-corpo");
            tabelaCorpo.innerHTML = ""; // Limpa a tabela antes de atualizar

            // Separa os dados em registros pendentes e outros registros
            var pendentes = [];
            var outros = [];
            for (var i = 0; i < dados.length; i++) {
                if (dados[i].SITUACAO.toLowerCase() === "PENDENTE") {
                    pendentes.push(dados[i]);
                } else {
                    outros.push(dados[i]);
                }
            }

            // Ordena os registros pendentes primeiro
            pendentes.sort(function (a, b) {
                return a.ID_PESSOA - b.ID_PESSOA;
            });

            // Ordena os outros registros
            outros.sort(function (a, b) {
                return a.ID_PESSOA - b.ID_PESSOA;
            });

            // Combina os dois conjuntos de dados ordenados
            var dadosOrdenados = pendentes.concat(outros);

            // Calcula os índices inicial e final dos dados a serem exibidos
            var inicio = (paginaAtual - 1) * registrosPorPagina;
            var fim = inicio + registrosPorPagina;

            // Cria uma div para tornar a tabela scrollable
            var divTabela = document.createElement("div");
            divTabela.style.overflowY = "auto"; // Adiciona rolagem vertical
            divTabela.style.maxHeight = "750px"; // Define a altura máxima da tabela

            // Cria a tabela
            var tabela = document.createElement("table");
            tabela.style.width = "100%";

            // Cria o cabeçalho da tabela
            var cabecalho = "<thead><tr>";
            cabecalho += "<th style='position: sticky; top: 0; background-color: #f2f2f2;'>ID</th>";
            cabecalho += "<th style='position: sticky; top: 0; background-color: #f2f2f2;'>Nome</th>";
            cabecalho += "<th style='position: sticky; top: 0; background-color: #f2f2f2;'>Idade</th>";
            cabecalho += "<th style='position: sticky; top: 0; background-color: #f2f2f2;'>Contato</th>";
            cabecalho += "<th style='position: sticky; top: 0; background-color: #f2f2f2;'>IASD</th>";
            cabecalho += "<th style='position: sticky; top: 0; background-color: #f2f2f2;'>Cozinha Própria</th>";
            cabecalho += "<th style='position: sticky; top: 0; background-color: #f2f2f2;'>Situação</th>";
            cabecalho += "<th style='position: sticky; top: 0; background-color: #f2f2f2;'>Observação</th>";
            cabecalho += "<th style='position: sticky; top: 0; background-color: #f2f2f2;'>Ações</th>";
            cabecalho += "</tr></thead>";
            tabela.innerHTML += cabecalho;

            // Loop apenas para os dados da página atual
            for (var i = inicio; i < Math.min(fim, dadosOrdenados.length); i++) {
                var linha = "<tr>";
                linha += "<td class='idclass'>" + dadosOrdenados[i].ID_PESSOA + "</td>";
                linha += "<td>" + dadosOrdenados[i].NOME_PESSOA + "</td>";
                linha += "<td>" + dadosOrdenados[i].IDADE + "</td>";
                linha += "<td>" + dadosOrdenados[i].CONTATO + "</td>";
                linha += "<td>" + dadosOrdenados[i].IASD + "</td>";
                linha += "<td>" + dadosOrdenados[i].COZINHA_PROPRIA + "</td>";
                linha += "<td style='word-wrap: break-word; max-width: 200px;'>" + dadosOrdenados[i].SITUACAO + "</td>"; // Preenche com "Pendente" por padrão e permite quebra de linha
                linha += "<td class='observacao' onclick='editarObservacao(" + dadosOrdenados[i].ID_PESSOA + ", \"" + dadosOrdenados[i].OBSERVACAO + "\")' style='word-wrap: break-word; max-width: 200px;'>" + dadosOrdenados[i].OBSERVACAO + "</td>"; // Permite quebra de linha na observação
                linha += "<td>";
                linha += "<div class='botoes-acao'>";
                linha += "<button class='pago' onclick='acaoPago(" + dadosOrdenados[i].ID_PESSOA + ")'>PAGO</button>";
                linha += "<button class='pendente' onclick='acaoPendente(" + dadosOrdenados[i].ID_PESSOA + ")'>PENDENTE</button>";
                linha += "<button class ='excluir' onclick='acaoExcluir(" + dadosOrdenados[i].ID_PESSOA + ")'>EXCLUIR</button>";
                linha += "</div>";
                linha += "</td>"; // Botões de ação
                linha += "</tr>";
                tabela.innerHTML += linha;
            }

            // Adiciona a tabela à div
            divTabela.appendChild(tabela);

            // Adiciona a div com a tabela ao corpo da tabela
            tabelaCorpo.appendChild(divTabela);
        }
    };
    xmlhttp.open("GET", "ajax.php", true);
    xmlhttp.send();
}



/// Função para realizar a ação de "PAGO"
function acaoPago(idPessoa) {
    // Caixa de diálogo para inserir a observação
    Swal.fire({
        title: 'Adicionar Observação',
        input: 'text',
        inputPlaceholder: 'Insira sua observação (opcional)',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        preConfirm: (observacao) => {
            // Realiza a chamada AJAX para alterar o status para PAGO com a observação, se fornecida
            return new Promise((resolve) => {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var response = JSON.parse(this.responseText);
                        if (response.statusChanged) {
                            console.log("Atualizado para PAGO com sucesso!");
                            // Atualiza a tabela após a operação ser realizada
                            carregarDadosTabela(paginaAtual, registrosPorPagina);
                            Swal.fire({
                                icon: 'success',
                                title: 'Sucesso!',
                                text: 'Status Alterado para PAGO com sucesso!'
                            });
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Atenção!',
                                text: 'Este registro já está com o status PAGO.'
                            });
                        }
                        resolve();
                    }
                };
                xmlhttp.open("POST", "pagar.php", true);
                xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                // Envie também a observação, se fornecida
                var dataToSend = "idPessoa=" + idPessoa + "&status=PAGO";
                if (observacao) {
                    dataToSend += "&observacao=" + observacao;
                }
                xmlhttp.send(dataToSend);
            });
        }
    });
}


// Função para realizar a ação de "PENDENTE"
function acaoPendente(idPessoa) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response.statusChanged) {
                console.log("Atualizado para PENDENTE com sucesso!");
                // Atualiza a tabela após a operação ser realizada
                carregarDadosTabela(paginaAtual, registrosPorPagina);
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: 'Status Alterado para PENDENTE com sucesso!'
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Atenção!',
                    text: 'Este registro já está com o status PENDENTE.'
                });
            }
        }
    };
    xmlhttp.open("POST", "pendente.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("idPessoa=" + idPessoa + "&status=PENDENTE");
}

// Função para realizar a ação de exclusão
function acaoExcluir(idPessoa) {
    // Alerta de confirmação antes de excluir o registro
    Swal.fire({
        icon: 'warning',
        title: 'Tem certeza?',
        text: 'Você deseja realmente excluir este registro?',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Se o usuário clicar em "Sim, excluir!", proceda com a exclusão
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("Registro excluído com sucesso!");
                    // Atualiza a tabela após a operação ser realizada
                    carregarDadosTabela(paginaAtual, registrosPorPagina);
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: 'Registro excluído com sucesso!'
                    });
                }
            };
            xmlhttp.open("POST", "excluir.php", true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send("idPessoa=" + idPessoa);
        }
    });
}

function editarObservacao(idPessoa, observacaoAtual) {
    Swal.fire({
        title: 'Editar Observação',
        input: 'textarea',
        inputPlaceholder: 'Digite sua observação aqui...',
        inputValue: observacaoAtual,
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        preConfirm: (observacaoEditada) => {
            return fetch('observacaoEdit.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'idPessoa=' + encodeURIComponent(idPessoa) + '&observacao=' + encodeURIComponent(observacaoEditada),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                    return response.json();
                })
                .catch(error => {
                    Swal.showValidationMessage(
                        `Erro ao enviar observação: ${error}`
                    )
                })
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            if (result.value.statusChanged) {
                Swal.fire(
                    'Sucesso!',
                    'Observação atualizada com sucesso!',
                    'success'
                );
                // Atualiza a tabela após a observação ser atualizada com sucesso
                carregarDadosTabela(paginaAtual, registrosPorPagina);
            } else {
                Swal.fire(
                    'Erro!',
                    'Falha ao atualizar observação!',
                    'error'
                );
            }
        }
    });
}



function gerarRelatorio() {
    // Defina a largura da janela pop-up como 90% da largura da tela
    var larguraJanela = window.screen.availWidth * 0.8;

    // Crie uma nova janela pop-up com a largura calculada
    var janelaRelatorio = window.open('', '_blank', 'height=800,width=' + larguraJanela);

    // Crie o conteúdo do relatório
    var relatorioConteudo = "<h1>Inscritos Retiro 2025</h1>";

    // Faça uma solicitação AJAX para buscar os dados do PHP
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var dados = JSON.parse(this.responseText);

            // Inicie a tabela no conteúdo do relatório
            relatorioConteudo += "<table class='relatorio-tabela'>";
            relatorioConteudo += "<thead><tr>";
            relatorioConteudo += "<th>Nome</th>";
            relatorioConteudo += "<th>Idade</th>";
            relatorioConteudo += "<th>Cozinha</th>";
            relatorioConteudo += "<th>IASD</th>";
            relatorioConteudo += "<th>Status</th>";
            relatorioConteudo += "<th>Observação</th>";
            relatorioConteudo += "</tr></thead>";
            relatorioConteudo += "<tbody>";

            // Adicione os dados na tabela
            for (var i = 0; i < dados.length; i++) {
                relatorioConteudo += "<tr>";
                relatorioConteudo += "<td>" + dados[i].NOME_PESSOA + "</td>";
                relatorioConteudo += "<td>" + dados[i].IDADE + "</td>";
                relatorioConteudo += "<td>" + dados[i].COZINHA_PROPRIA  + "</td>";
                relatorioConteudo += "<td>" + dados[i].IASD + "</td>";
                relatorioConteudo += "<td>" + dados[i].SITUACAO + "</td>";
                relatorioConteudo += "<td class='observacao' style='word-break: break-all;' onclick='editarObservacao(" + dados[i].ID_PESSOA + ", \"" + dados[i].OBSERVACAO + "\")'>" + dados[i].OBSERVACAO + "</td>";
                relatorioConteudo += "</tr>";
            }

            // Feche a tabela no conteúdo do relatório
            relatorioConteudo += "</tbody></table>";
            relatorioConteudo += "<h5 class='instrucao-impressao'>Para imprimir, pressione simultaneamente as teclas CTRL + P.</h5>";

            // Escreva o conteúdo na janela pop-up
            janelaRelatorio.document.write('<html><head><title>Relatório</title>');
            janelaRelatorio.document.write('<style>');
            janelaRelatorio.document.write('@media print { .instrucao-impressao { display: none !important; } }'); // Garante que a classe seja ocultada durante a impressão
            janelaRelatorio.document.write('.relatorio-tabela { width: 100%; border-collapse: collapse; }'); // Tabela ocupa toda a largura da página e remove as linhas entre as células
            janelaRelatorio.document.write('.relatorio-tabela th, .relatorio-tabela td { padding: 8px; text-align: left; }'); // Adiciona espaçamento interno e alinha o texto à esquerda
            janelaRelatorio.document.write('</style>');
            janelaRelatorio.document.write('</head><body>');
            janelaRelatorio.document.write(relatorioConteudo);
            janelaRelatorio.document.write('</body></html>');

            // Aguarde a janela ser carregada antes de chamar a função de impressão
            janelaRelatorio.onload = function () {
                // Chame a função de impressão
                janelaRelatorio.print();
            };
        }
    };
    xmlhttp.open("GET", "relatorio.php", true); // Chama o arquivo PHP que executa a consulta
    xmlhttp.send();
}




// Função para navegar para a página anterior
function paginaAnterior() {
    if (paginaAtual > 1) {
        paginaAtual--;
        carregarDadosTabela(paginaAtual, registrosPorPagina);
    }
}

// Função para navegar para a próxima página
function proximaPagina() {
    // Você precisa saber o número total de páginas para verificar se é possível ir para a próxima página
    // Supondo que você tenha essa informação disponível em uma variável chamada totalPaginas
    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        carregarDadosTabela(paginaAtual, registrosPorPagina);
    }
}

// Carrega os dados da tabela quando a página é carregada
window.onload = function () {
    carregarDadosTabela(paginaAtual, registrosPorPagina);
};
