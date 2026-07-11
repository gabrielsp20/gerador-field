const formChamado = document.getElementById("formChamado");
const textoGerado = document.getElementById("textoGerado");
const copiarTexto = document.getElementById("copiarTexto");
const mensagemFormulario = document.getElementById("mensagemFormulario");
const limparFormulario = document.getElementById("limparFormulario");
const salvarRascunho = document.getElementById("salvarRascunho");
const apagarRascunho = document.getElementById("apagarRascunho");
const salvarHistorico = document.getElementById("salvarHistorico");
const listaHistorico = document.getElementById("listaHistorico");
const historicoVazio = document.getElementById("historicoVazio");

let historico = JSON.parse(localStorage.getItem("historicoField")) || [];

function mostrarMensagem(texto, tipo) {
  mensagemFormulario.textContent = texto;
  mensagemFormulario.className = `mensagem ${tipo}`;
}

function renderizarHistorico() {
  listaHistorico.innerHTML = "";

  if (historico.length === 0) {
    historicoVazio.style.display = "block";
    return;
  }

  historicoVazio.style.display = "none";

  historico.forEach(function (registro) {
    const item = document.createElement("li");
    item.className = "item-historico";
    const titulo = document.createElement("strong");
    titulo.textContent = registro.equipamento;
    const data = document.createElement("span");
    data.textContent = registro.data;

    const botaoVisualizar = document.createElement("button");
    botaoVisualizar.type = "button";
    botaoVisualizar.className = "botao-historico";
    botaoVisualizar.textContent = "Visualizar texto";

    botaoVisualizar.addEventListener("click", function () {
      textoGerado.value = registro.texto;

      mostrarMensagem("Encaminhamento carregado do histórico.", "sucesso");
    });

    const acoes = document.createElement("div");
    acoes.className = "acoes-historico";

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.className = "botao-historico botao-excluir-historico";
    botaoExcluir.textContent = "Excluir";

    botaoExcluir.addEventListener("click", function () {
      const confirmouExclusao = confirm(
        "Deseja excluir este encaminhamento do histórico?",
      );

      if (!confirmouExclusao) {
        return;
      }

      historico = historico.filter(function (itemHistorico) {
        return itemHistorico.id !== registro.id;
      });

      localStorage.setItem("historicoField", JSON.stringify(historico));

      renderizarHistorico();

      mostrarMensagem("Encaminhamento excluído do histórico.", "sucesso");
    });
    acoes.appendChild(botaoVisualizar);
    acoes.appendChild(botaoExcluir);
    item.appendChild(titulo);
    item.appendChild(data);
    item.appendChild(acoes);
    listaHistorico.appendChild(item);
  });
}

renderizarHistorico();

const rascunhoSalvo = localStorage.getItem("rascunhoField");

if (rascunhoSalvo !== null) {
  const rascunho = JSON.parse(rascunhoSalvo);

  document.getElementById("equipamento").value = rascunho.equipamento || "";
  document.getElementById("problema").value = rascunho.problema || "";
  document.getElementById("testes").value = rascunho.testes || "";
  document.getElementById("validacao").value = rascunho.validacao || "";
  document.getElementById("remoto").value = rascunho.remoto || "Sim";
  document.getElementById("observacao").value = rascunho.observacao || "";

  mostrarMensagem("Rascunho recuperado do navegador.", "sucesso");
}

formChamado.addEventListener("submit", function (event) {
  event.preventDefault();

  const equipamento = document.getElementById("equipamento").value.trim();
  const problema = document.getElementById("problema").value.trim();
  const testes = document.getElementById("testes").value.trim();
  const validacao = document.getElementById("validacao").value.trim();
  const remoto = document.getElementById("remoto").value;
  const observacao = document.getElementById("observacao").value.trim();

  if (
    equipamento === "" ||
    problema === "" ||
    testes === "" ||
    validacao === ""
  ) {
    mostrarMensagem(
      "Preencha os campos principais antes de gerar o texto.",
      "erro",
    );
    return;
  }

  const textoFinal = `TIPO DE EQUIPAMENTO:
${equipamento}

PROBLEMA CONSTATADO:
${problema}

SOLUÇÃO APLICADA:
${testes}

NOME DO USUÁRIO QUE VALIDOU:
${validacao}

REMOTO:
${remoto}

OBS:
${observacao || "Sem observações adicionais."}`;

  mostrarMensagem("Texto gerado com sucesso.", "sucesso");

  textoGerado.value = textoFinal;
});

copiarTexto.addEventListener("click", async function () {
  const texto = textoGerado.value.trim();

  if (texto === "") {
    mostrarMensagem("Gere um texto antes de copiar.", "erro");
    return;
  }

  try {
    await navigator.clipboard.writeText(texto);

    mostrarMensagem("Texto copiado para a área de transferência.", "sucesso");

    copiarTexto.textContent = "Texto copiado!";

    setTimeout(function () {
      copiarTexto.textContent = "Copiar texto";
    }, 2000);
  } catch (erro) {
    mostrarMensagem("Não foi possível copiar o texto.", "erro");

    console.error("Erro ao copiar o texto:", erro);
  }
});

limparFormulario.addEventListener("click", function () {
  formChamado.reset(); // Limpa os campos do formulário

  textoGerado.value = ""; // Limpa o texto gerado

  mensagemFormulario.textContent = ""; // Apaga a mensagem
  mensagemFormulario.className = "mensagem"; // Volta ao estilo padrão

  copiarTexto.textContent = "Copiar texto"; // Restaura o botão
});

salvarRascunho.addEventListener("click", function () {
  const rascunho = {
    equipamento: document.getElementById("equipamento").value.trim(),
    problema: document.getElementById("problema").value.trim(),
    testes: document.getElementById("testes").value.trim(),
    validacao: document.getElementById("validacao").value.trim(),
    remoto: document.getElementById("remoto").value,
    observacao: document.getElementById("observacao").value.trim(),
  };

  if (
    rascunho.equipamento === "" &&
    rascunho.problema === "" &&
    rascunho.testes === "" &&
    rascunho.validacao === "" &&
    rascunho.observacao === ""
  ) {
    mostrarMensagem("Preencha algum campo antes de salvar o rascunho.", "erro");
    return;
  }

  localStorage.setItem("rascunhoField", JSON.stringify(rascunho));

  mostrarMensagem("Rascunho salvo no navegador.", "sucesso");
});

apagarRascunho.addEventListener("click", function () {
  const rascunhoExistente = localStorage.getItem("rascunhoField");

  if (rascunhoExistente === null) {
    mostrarMensagem("Não existe nenhum rascunho salvo.", "erro");
    return;
  }

  localStorage.removeItem("rascunhoField");

  formChamado.reset();

  textoGerado.value = "";

  mostrarMensagem("Rascunho apagado com sucesso.", "sucesso");
});

salvarHistorico.addEventListener("click", function () {
  const texto = textoGerado.value.trim();

  const equipamento = document.getElementById("equipamento").value.trim();

  if (texto === "") {
    mostrarMensagem("Gere um texto antes de salvar no histórico.", "erro");
    return;
  }

  if (equipamento === "") {
    mostrarMensagem(
      "Informe o equipamento antes de salvar no histórico.",
      "erro",
    );
    return;
  }

  const registro = {
    id: Date.now(),
    equipamento,
    data: new Date().toLocaleString("pt-BR"),
    texto,
  };

  historico.unshift(registro);

  localStorage.setItem("historicoField", JSON.stringify(historico));

  renderizarHistorico();

  mostrarMensagem("Encaminhamento salvo no histórico.", "sucesso");
});
