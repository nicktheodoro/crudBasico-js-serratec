const URL = `http://localhost:3000`;
let listaDeProdutos = [];
let tbody = document.querySelector("table>tbody");

// Aqui estou capturando os elementos da tela.
let form = {
  campoNome: document.getElementById("nome"),
  campoQuantidade: document.getElementById("quantidade"),
  campoValor: document.getElementById("valor"),
  btnSalvar: document.getElementById("btn-salvar"),
  btnCancelar: document.getElementById("btn-cancelar"),
};

form.btnSalvar.addEventListener("click", (e) => {
  e.preventDefault();
  let nome = form.campoNome.value;
  let quantidade = form.campoQuantidade.value;
  let valor = form.campoValor.value;

  let produto = new Produto({
    nome,
    quantidadeEstoque: quantidade,
    valor,
  });

  if (!produto.modeloValidoParaCadastro()) {
    alterarLayoutObrigatorio();
    alert("Os campos Nome, Quantidade e Valor são obrigatórios.");
    return;
  }

  adicionarProdutoNoBackEnd(produto);
});

form.btnCancelar.addEventListener("click", (e) => {
  e.preventDefault();
  removerLayoutObrigatorio();
  fecharModal();
});

form.campoNome.addEventListener("change", (e) => {
  e.preventDefault();

  if (!e.target.value.toString().trim()) {
    form.campoNome.classList.add("obrigatorio");
  } else {
    form.campoNome.classList.remove("obrigatorio");
  }
});

form.campoQuantidade.addEventListener("change", (e) => {
  e.preventDefault();

  if (!e.target.value) {
    form.campoQuantidade.classList.add("obrigatorio");
  } else {
    form.campoQuantidade.classList.remove("obrigatorio");
  }
});

form.campoValor.addEventListener("change", (e) => {
  e.preventDefault();

  if (!e.target.value.toString().trim()) {
    form.campoValor.classList.add("obrigatorio");
  } else {
    form.campoValor.classList.remove("obrigatorio");
  }
});

function alterarLayoutObrigatorio() {
  form.campoNome.classList.add("obrigatorio");
  form.campoQuantidade.classList.add("obrigatorio");
  form.campoValor.classList.add("obrigatorio");
}

function removerLayoutObrigatorio() {
  form.campoNome.classList.remove("obrigatorio");
  form.campoQuantidade.classList.remove("obrigatorio");
  form.campoValor.classList.remove("obrigatorio");
}

function obterListaDeProdutos() {
  fetch(`${URL}/produtos`)
    .then((resposta) => resposta.json())
    .then((resposta) => {
      resposta.forEach((item) => {
        listaDeProdutos.push(new Produto(item));
      });

      popularTabela(listaDeProdutos);
    })
    .catch(() => alert("Não foi possível obter os produtos"));
}

function popularTabela(listaDeProdutos) {
  //    Aqui limpar a tabela
  tbody.textContent = "";

  listaDeProdutos.forEach((produto) => {
    adicionarNovoProdutoATabela(produto);
  });
}

function criarTrComBaseNoProduto(produto) {
  let tr = document.createElement("tr");
  let tdId = document.createElement("td");
  let tdNome = document.createElement("td");
  let tdEstoque = document.createElement("td");
  let tdValor = document.createElement("td");
  let tdOpcoes = document.createElement("td");

  tdId.textContent = produto.id;
  tdNome.textContent = produto.nome;
  tdEstoque.textContent = produto.quantidadeEstoque;
  tdValor.textContent = Number(produto.valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  tdOpcoes.innerHTML = `<button onclick="editar(${produto.id})" class="btn
                        btn-outline-info btn-sm">Editar</button>
                        <button onclick="deletar(${produto.id})" 
                        class="btn btn-outline-info btn-sm">Excluir</button>`;

  tr.appendChild(tdId);
  tr.appendChild(tdNome);
  tr.appendChild(tdEstoque);
  tr.appendChild(tdValor);
  tr.appendChild(tdOpcoes);

  return tr;
}

function deletar(id) {
  fetch(`${URL}/produtos/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(() => {
      alert("Produto deletado com sucesso!");
      // Remover o produto da tabela.
      let indice = listaDeProdutos.findIndex((p) => p.id == id);
      listaDeProdutos.splice(indice, 1);

      // Aqui não vou no backend novamente, só atualizo a tabela
      popularTabela(listaDeProdutos);
    })
    .catch(() => alert("Falha ao deletar o produto id " + id));
}

function editar(produto) {
  // Desafio pra quem quiser fazer ...
}
function adicionarProdutoNoBackEnd(produto) {
  fetch(`${URL}/produtos`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(produto),
  })
    .then((resposta) => resposta.json())
    .then((resposta) => {
      let produto = new Produto(resposta);
      // Adicionar o produto na lista
      listaDeProdutos.push(produto);

      // Adicionamos o produto na tabela.
      adicionarNovoProdutoATabela(produto);
      // limpar campos
      limparCampos();
      // fechar modal
      fecharModal();
    })
    .catch(() => alert("Deu ruim no cadastro :("));
}

function limparCampos() {
  form.campoNome.value = "";
  form.campoQuantidade.value = "";
  form.campoValor.value = "";
  removerLayoutObrigatorio();
}

function adicionarNovoProdutoATabela(produto) {
  let tr = criarTrComBaseNoProduto(produto);
  tbody.appendChild(tr);
}

function fecharModal() {
  $("#meu-modal").modal("hide");
}

obterListaDeProdutos();
