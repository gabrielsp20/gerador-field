const CHAVE_RASCUNHO = "rascunhoField";
const CHAVE_HISTORICO = "historicoField";

const formChamado = document.getElementById("formChamado");
const textoGerado = document.getElementById("textoGerado");
const mensagemFormulario = document.getElementById("mensagemFormulario");
const statusSalvamento = document.getElementById("statusSalvamento");
const listaHistorico = document.getElementById("listaHistorico");
const historicoVazio = document.getElementById("historicoVazio");
const contadorHistorico = document.getElementById("contadorHistorico");
const pesquisaHistorico = document.getElementById("pesquisaHistorico");

const campos = {
  tipoEncerramento: document.getElementById("tipoEncerramento"),
  chamado: document.getElementById("chamado"),
  hostname: document.getElementById("hostname"),
  chamadoEncaminhamento: document.getElementById("chamadoEncaminhamento"),
  timeResponsavel: document.getElementById("timeResponsavel"),
  equipamento: document.getElementById("equipamento"),
  problema: document.getElementById("problema"),
  solucao: document.getElementById("solucao"),
  validacao: document.getElementById("validacao"),
  remoto: document.getElementById("remoto"),
  observacao: document.getElementById("observacao"),
};

const nomesTipos = {
  personalizado: "Personalizado",
  "resolvido-remotamente": "Resolvido remotamente",
  "usuario-resolveu": "Usuário informou que o problema foi resolvido",
  "encaminhado-field": "Encaminhado para Field",
  "encaminhado-outro-time": "Encaminhado para outro time",
  "limpeza-disco": "Limpeza de disco realizada",
  "sem-contato": "Sem contato com o usuário",
  "fora-dominio": "Equipamento fora do domínio",
  "impressora-periferico": "Impressora ou periférico",
};

const modelos = {
  "resolvido-remotamente": {
    solucao: "Foi realizado acesso remoto ao equipamento, aplicada a correção necessária e efetuados testes de funcionamento. Após a intervenção, o serviço voltou a operar normalmente.",
    observacao: "Atendimento validado pelo usuário.",
  },
  "usuario-resolveu": {
    solucao: "O usuário informou que o problema relatado foi resolvido e confirmou que o serviço está funcionando normalmente.",
    observacao: "Chamado encerrado após confirmação do usuário.",
  },
  "encaminhado-field": {
    solucao: "Tarefas encerradas. Após análise e tentativas de correção remota, foi identificada a necessidade de atendimento presencial. A tratativa definitiva será realizada pelo Field no chamado nº [INFORMAR CHAMADO DE ENCAMINHAMENTO].",
    observacao: "Atendimento encaminhado para continuidade pelo Field.",
  },
  "encaminhado-outro-time": {
    solucao: "Tarefas encerradas. Após análise e tentativas de correção remota, foi identificado que a tratativa definitiva deverá ser realizada pelo time responsável no chamado nº [INFORMAR CHAMADO DE ENCAMINHAMENTO].",
    observacao: "Atendimento encaminhado para continuidade pelo time responsável.",
  },
  "limpeza-disco": {
    problema: "Equipamento apresentava baixo espaço disponível na unidade C:, com impacto no desempenho e no funcionamento do sistema.",
    solucao: "Foi realizada limpeza de arquivos temporários e itens desnecessários. Após o procedimento, o espaço disponível em disco foi verificado e o funcionamento do equipamento foi validado.",
    observacao: "Limpeza concluída e validada pelo usuário.",
  },
  "sem-contato": {
    solucao: "Foram realizadas tentativas de contato com o usuário, porém não houve retorno para continuidade da análise e validação do atendimento.",
    observacao: "Chamado encerrado por ausência de retorno do usuário.",
  },
  "fora-dominio": {
    problema: "Foi identificado que o equipamento está fora do domínio corporativo.",
    solucao: "Tarefas encerradas. A correção requer formatação do equipamento e ingresso no domínio corporativo. A tratativa definitiva será realizada pelo Field no chamado nº [INFORMAR CHAMADO DE ENCAMINHAMENTO].",
    observacao: "Usuário orientado a validar se o equipamento está dentro do padrão corporativo.",
  },
  "impressora-periferico": {
    problema: "Foi identificada falha de funcionamento na impressora ou no periférico informado.",
    solucao: "Foram realizados acesso remoto, validações de configuração e testes de funcionamento. A tratativa foi registrada conforme o resultado da análise.",
    observacao: "Registrar neste campo eventual necessidade de atendimento presencial ou troca do equipamento.",
  },
};

function lerJsonSeguro(chave, valorPadrao) {
  try {
    const valor = localStorage.getItem(chave);
    return valor === null ? valorPadrao : JSON.parse(valor);
  } catch (erro) {
    console.error(`Não foi possível ler ${chave}:`, erro);
    return valorPadrao;
  }
}

let historico = lerJsonSeguro(CHAVE_HISTORICO, []);
if (!Array.isArray(historico)) historico = [];

function mostrarMensagem(texto, tipo = "") {
  mensagemFormulario.textContent = texto;
  mensagemFormulario.className = `mensagem ${tipo}`.trim();
}

function obterDadosFormulario() {
  const dados = {};
  Object.entries(campos).forEach(([nome, elemento]) => {
    dados[nome] = elemento.value.trim();
  });
  dados.textoGerado = textoGerado.value;
  // Compatibilidade com versões antigas que usavam o nome "testes".
  dados.testes = dados.solucao;
  return dados;
}

function preencherFormulario(dados = {}) {
  campos.tipoEncerramento.value = dados.tipoEncerramento || "personalizado";
  campos.chamado.value = dados.chamado || "";
  campos.hostname.value = dados.hostname || "";
  campos.chamadoEncaminhamento.value = dados.chamadoEncaminhamento || "";
  campos.timeResponsavel.value = dados.timeResponsavel || "";
  campos.equipamento.value = dados.equipamento || "";
  campos.problema.value = dados.problema || "";
  campos.solucao.value = dados.solucao || dados.testes || "";
  campos.validacao.value = dados.validacao || "";
  campos.remoto.value = dados.remoto || "Sim";
  campos.observacao.value = dados.observacao || "";
  textoGerado.value = dados.textoGerado || "";
}

let temporizadorSalvamento;
function salvarRascunhoAutomaticamente() {
  clearTimeout(temporizadorSalvamento);
  statusSalvamento.textContent = "Salvando...";
  temporizadorSalvamento = setTimeout(() => {
    try {
      localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(obterDadosFormulario()));
      statusSalvamento.textContent = "Rascunho salvo automaticamente";
    } catch (erro) {
      statusSalvamento.textContent = "Falha ao salvar rascunho";
      console.error("Erro ao salvar rascunho:", erro);
    }
  }, 400);
}

function substituirMarcadores(texto) {
  const chamadoEncaminhamento = campos.chamadoEncaminhamento.value.trim();
  return texto.replace(
    "[INFORMAR CHAMADO DE ENCAMINHAMENTO]",
    chamadoEncaminhamento || "[INFORMAR CHAMADO DE ENCAMINHAMENTO]",
  );
}

function aplicarModelo() {
  const tipo = campos.tipoEncerramento.value;
  const modelo = modelos[tipo];
  if (!modelo) {
    mostrarMensagem("O tipo Personalizado não possui texto predefinido.", "erro");
    return;
  }

  const possuiConteudo = ["problema", "solucao", "observacao"].some(
    (campo) => campos[campo].value.trim() !== "",
  );
  if (possuiConteudo && !confirm("Aplicar o modelo substituirá Problema, Solução e Observação que já estiverem preenchidos. Deseja continuar?")) return;

  campos.problema.value = substituirMarcadores(modelo.problema || "");
  campos.solucao.value = substituirMarcadores(modelo.solucao || "");
  campos.observacao.value = substituirMarcadores(modelo.observacao || "");
  salvarRascunhoAutomaticamente();
  mostrarMensagem("Modelo aplicado. Revise e complete as informações antes de gerar.", "sucesso");
}

function validarFormulario() {
  const obrigatorios = [campos.equipamento, campos.problema, campos.solucao, campos.validacao];
  if (obrigatorios.some((campo) => campo.value.trim() === "")) {
    mostrarMensagem("Preencha Tipo de equipamento, Problema constatado, Solução aplicada e Usuário que validou.", "erro");
    return false;
  }
  return true;
}

function gerarTexto() {
  if (!validarFormulario()) return "";
  const dados = obterDadosFormulario();
  const linhasOpcionais = [];
  if (dados.chamado) linhasOpcionais.push(`NÚMERO DO CHAMADO:\n${dados.chamado}`);
  if (dados.hostname) linhasOpcionais.push(`HOSTNAME:\n${dados.hostname}`);
  if (dados.chamadoEncaminhamento) linhasOpcionais.push(`CHAMADO DE ENCAMINHAMENTO:\n${dados.chamadoEncaminhamento}`);
  if (dados.timeResponsavel) linhasOpcionais.push(`TIME RESPONSÁVEL:\n${dados.timeResponsavel}`);

  const texto = `${linhasOpcionais.length ? `${linhasOpcionais.join("\n\n")}\n\n` : ""}TIPO DE EQUIPAMENTO:
${dados.equipamento}

PROBLEMA CONSTATADO:
${dados.problema}

SOLUÇÃO APLICADA:
${dados.solucao}

NOME DO USUÁRIO QUE VALIDOU:
${dados.validacao}

REMOTO:
${dados.remoto}

OBS:
${dados.observacao || "Sem observações adicionais."}`;

  textoGerado.value = texto;
  salvarRascunhoAutomaticamente();
  mostrarMensagem("Texto gerado com sucesso. Você pode editá-lo antes de copiar.", "sucesso");
  return texto;
}

async function copiarParaAreaTransferencia(texto) {
  try {
    await navigator.clipboard.writeText(texto);
  } catch (erro) {
    textoGerado.focus();
    textoGerado.select();
    if (!document.execCommand("copy")) throw erro;
  }
}

async function copiarTextoAtual() {
  const texto = textoGerado.value.trim();
  if (!texto) {
    mostrarMensagem("Gere um texto antes de copiar.", "erro");
    return false;
  }
  try {
    await copiarParaAreaTransferencia(texto);
    mostrarMensagem("Texto copiado para a área de transferência.", "sucesso");
    return true;
  } catch (erro) {
    mostrarMensagem("Não foi possível copiar o texto.", "erro");
    console.error("Erro ao copiar:", erro);
    return false;
  }
}

function textoPesquisaRegistro(registro) {
  return [
    registro.chamado, registro.hostname, registro.validacao, registro.equipamento,
    nomesTipos[registro.tipoEncerramento], registro.texto, registro.data,
  ].filter(Boolean).join(" ").toLocaleLowerCase("pt-BR");
}

function criarBotaoHistorico(texto, acao, classeExtra = "") {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = `botao-historico ${classeExtra}`.trim();
  botao.textContent = texto;
  botao.addEventListener("click", acao);
  return botao;
}

function renderizarHistorico() {
  const termo = pesquisaHistorico.value.trim().toLocaleLowerCase("pt-BR");
  const registros = historico.filter((registro) => !termo || textoPesquisaRegistro(registro).includes(termo));
  listaHistorico.innerHTML = "";
  contadorHistorico.textContent = `${historico.length} ${historico.length === 1 ? "registro salvo" : "registros salvos"}`;

  if (registros.length === 0) {
    historicoVazio.style.display = "block";
    historicoVazio.textContent = historico.length === 0 ? "Nenhum encerramento salvo." : "Nenhum registro encontrado para esta pesquisa.";
    return;
  }
  historicoVazio.style.display = "none";

  registros.forEach((registro) => {
    const item = document.createElement("li");
    item.className = "item-historico";

    const cabecalho = document.createElement("div");
    cabecalho.className = "cabecalho-historico";
    const titulo = document.createElement("strong");
    titulo.textContent = registro.chamado || registro.hostname || registro.equipamento || "Encerramento";
    const data = document.createElement("span");
    data.textContent = registro.data || "Data não informada";
    cabecalho.append(titulo, data);

    const metadados = document.createElement("p");
    metadados.className = "metadados-historico";
    metadados.textContent = [
      registro.equipamento,
      registro.validacao && `Usuário: ${registro.validacao}`,
      registro.tipoEncerramento && nomesTipos[registro.tipoEncerramento],
    ].filter(Boolean).join(" • ");

    const acoes = document.createElement("div");
    acoes.className = "acoes-historico";
    acoes.append(
      criarBotaoHistorico("Visualizar", () => {
        textoGerado.value = registro.texto || "";
        textoGerado.scrollIntoView({ behavior: "smooth", block: "center" });
        salvarRascunhoAutomaticamente();
        mostrarMensagem("Encerramento carregado do histórico.", "sucesso");
      }),
      criarBotaoHistorico("Copiar", async () => {
        try {
          await copiarParaAreaTransferencia(registro.texto || "");
          mostrarMensagem("Texto do histórico copiado.", "sucesso");
        } catch (erro) {
          mostrarMensagem("Não foi possível copiar o texto do histórico.", "erro");
        }
      }),
      criarBotaoHistorico("Reutilizar", () => {
        preencherFormulario({ ...registro, textoGerado: registro.texto || "" });
        salvarRascunhoAutomaticamente();
        formChamado.scrollIntoView({ behavior: "smooth", block: "start" });
        mostrarMensagem("Registro carregado no formulário. Faça as alterações necessárias.", "sucesso");
      }),
      criarBotaoHistorico("Excluir", () => {
        if (!confirm("Deseja excluir este encerramento do histórico?")) return;
        historico = historico.filter((itemHistorico) => itemHistorico.id !== registro.id);
        localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
        renderizarHistorico();
        mostrarMensagem("Encerramento excluído do histórico.", "sucesso");
      }, "botao-excluir-historico"),
    );

    item.append(cabecalho, metadados, acoes);
    listaHistorico.appendChild(item);
  });
}

formChamado.addEventListener("submit", (event) => {
  event.preventDefault();
  gerarTexto();
});

formChamado.addEventListener("input", salvarRascunhoAutomaticamente);
formChamado.addEventListener("change", salvarRascunhoAutomaticamente);
textoGerado.addEventListener("input", salvarRascunhoAutomaticamente);
document.getElementById("aplicarModelo").addEventListener("click", aplicarModelo);
document.getElementById("copiarTexto").addEventListener("click", copiarTextoAtual);
document.getElementById("gerarCopiar").addEventListener("click", async () => {
  if (gerarTexto()) await copiarTextoAtual();
});

document.getElementById("limparFormulario").addEventListener("click", () => {
  if (!confirm("Deseja limpar o formulário e o texto gerado? O histórico não será alterado.")) return;
  formChamado.reset();
  textoGerado.value = "";
  localStorage.removeItem(CHAVE_RASCUNHO);
  statusSalvamento.textContent = "";
  mostrarMensagem("Formulário limpo. O histórico foi preservado.", "sucesso");
});

document.getElementById("apagarRascunho").addEventListener("click", () => {
  if (localStorage.getItem(CHAVE_RASCUNHO) === null) {
    mostrarMensagem("Não existe nenhum rascunho salvo.", "erro");
    return;
  }
  if (!confirm("Deseja apagar o rascunho salvo? O histórico não será alterado.")) return;
  localStorage.removeItem(CHAVE_RASCUNHO);
  formChamado.reset();
  textoGerado.value = "";
  statusSalvamento.textContent = "";
  mostrarMensagem("Rascunho apagado. O histórico foi preservado.", "sucesso");
});

document.getElementById("salvarHistorico").addEventListener("click", () => {
  const texto = textoGerado.value.trim();
  if (!texto) {
    mostrarMensagem("Gere um texto antes de salvar no histórico.", "erro");
    return;
  }
  const dados = obterDadosFormulario();
  const registro = {
    ...dados,
    id: Date.now(),
    data: new Date().toLocaleString("pt-BR"),
    texto,
  };
  historico.unshift(registro);
  localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
  renderizarHistorico();
  mostrarMensagem("Encerramento salvo no histórico.", "sucesso");
});

pesquisaHistorico.addEventListener("input", renderizarHistorico);

const rascunhoSalvo = lerJsonSeguro(CHAVE_RASCUNHO, null);
if (rascunhoSalvo) {
  preencherFormulario(rascunhoSalvo);
  mostrarMensagem("Rascunho recuperado do navegador.", "sucesso");
}
renderizarHistorico();
