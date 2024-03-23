const URL = 'http://localhost:3400/produtos'

let listaDeProdutos = [];
let btnAdicionar = document.querySelector('#btn-adicionar');
let tabelaProduto = document.querySelector('table>tbody');
let modalProduto = new bootstrap.Modal(document.getElementById('modal-produto'));

let modoEdicao = false;

let formModal = {
    titulo: document.querySelector('h4.modal-title'),
    id: document.querySelector("#id"),
    nome: document.querySelector("#produto"),
    valor: document.querySelector("#valor"),
    quantidadeEstoque: document.querySelector("#quantidade"),
    observacao: document.querySelector("#observacao"),
    dataCadastro: document.querySelector("#datacadastro"),
    btnSalvar: document.querySelector("#btnsalvar"),
    btnCancelar: document.querySelector("#btncancelar"),
}

//Obter produtos da API
function obterProdutos(){
    fetch(URL, {
        method: 'GET',
        headers: {
            'Authorization' : obterToken()
        }
    })

    .then(response => response.json())
    .then (produtos => {
        listaDeProdutos = produtos;
        popularTabela(produtos)
    })
    .catch((erro) => {})
}

btnAdicionar.addEventListener('click', ()=>{
    modoEdicao = false;
    formModal.titulo.textContent = "Adicionar Produto";

    limparModalProduto();
    modalProduto.show();
});

obterProdutos();

function popularTabela(produtos){

    tabelaProduto.textContent= '';

    produtos.forEach(produto => {
        criarLinhaNaTabela(produto);
    });
}

function criarLinhaNaTabela(produto){

    let tr = document.createElement('tr');

    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdValor = document.createElement('td');
    let tdQuantidadeEstoque = document.createElement('td');
    let tdObservacao = document.createElement('td');
    let tdDataCadastro = document.createElement('td');
    let tdAcoes = document.createElement('td');

    tdId.textContent = produto.id;
    tdNome.textContent = produto.nome;
    tdValor.textContent = produto.valor;
    tdQuantidadeEstoque.textContent = produto.quantidadeEstoque;
    tdObservacao.textContent = produto.observacao;
    tdDataCadastro.textContent = new Date(produto.dataCadastro).toLocaleDateString();
    tdAcoes.innerHTML = `<button onclick="editarProduto(${produto.id})" class="btn btn-outline-info btn-sm mr-3">Editar</button>
                         <button onclick="excluirProduto(${produto.id})" class="btn btn-outline-secondary btn-sm mr-3">Excluir</button>`
    

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdValor);
    tr.appendChild(tdQuantidadeEstoque);
    tr.appendChild(tdObservacao);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes)
    

    tabelaProduto.appendChild(tr);

}

formModal.btnSalvar.addEventListener('click', () =>{
     let produto = obterProdutoDoModal();

     if(!produto.validar()){
        
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Todos os Campos são Obrigatórios!",
          });
        return;
     }

     if(modoEdicao){
        atualizarProdutoNoBackend(produto);
     }else{
        adicionarProdutoNoBackend(produto);
     }
     
});

function atualizarProdutoNoBackend(produto){
    fetch(`${URL}/${produto.id}`, {
        method: 'PUT',
        headers:{
            Authorization: obterToken(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    })
    .then (() => {
        atualizarProdutoNaTela(produto);

        Swal.fire({
            title: "Atualizado com Sucesso",
            text: `Produto ${produto.nome}, atualizado com Sucesso!`,
            icon: "success"
          });

        modalProduto.hide()
    })
}

function atualizarProdutoNaTela(produto){
    let indice = listaDeProdutos.findIndex(p => p.id == produto.id);

    listaDeProdutos.splice(indice, 1, produto);

    popularTabela(listaDeProdutos);
}

function obterProdutoDoModal(){
    return new Produto({
        id: formModal.id.value,
        nome: formModal.nome.value,
        valor: formModal.valor.value,
        quantidadeEstoque: formModal.quantidadeEstoque.value,
        observacao: formModal.observacao.value,
        dataCadastro: (formModal.dataCadastro.value)
            ? new Date(formModal.dataCadastro.value).toISOString()
            : new Date().toISOString(),
    });
}

function adicionarProdutoNoBackend(produto){
    fetch(URL, {
        method: 'POST',
        headers:{
            Authorization: obterToken(), 
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    })
    .then(resposta => resposta.json())
    .then(response=> {
        let novoProduto = new Produto(response);
        listaDeProdutos.push(novoProduto);

        popularTabela(listaDeProdutos);

        modalProduto.hide();

        Swal.fire({
            title: "Cadastrado com Sucesso",
            text: `Produto ${produto.nome}, foi cadastrado com sucesso!`,
            icon: "success"
          });

    })
}

function limparModalProduto() {
    formModal.id.value = '';
    formModal.nome.value = '';
    formModal.valor.value= '';
    formModal.quantidadeEstoque.value='';
    formModal.observacao.value ='';
    formModal.dataCadastro.value = '';
}

function editarProduto(id){
    modoEdicao = true;
    formModal.titulo.textContent = "Editar Produto";

    let produto = listaDeProdutos.find(p => p.id == id);

    atualizarModalProduto(produto);

    modalProduto.show();
}

function atualizarModalProduto(produto){
    formModal.id.value = produto.id;
    formModal.nome.value = produto.nome;
    formModal.valor.value =  produto.valor;
    formModal.quantidadeEstoque.value = produto.quantidadeEstoque;
    formModal.observacao.value = produto.observacao;
    formModal.dataCadastro.value =  produto.dataCadastro.substring(0,10);
}

function excluirProduto(id){
    let produto = listaDeProdutos.find(produto => produto.id == id);
    
    if(confirm("Deseja Realmente Exluir o Produto " + produto.nome)){
        excluirProdutoNoBackend(id);
    }
}

function excluirProdutoNoBackend(id){
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: obterToken()
        }
    })
    .then(() => {
        removerProdutoDaLista(id);
        popularTabela(listaDeProdutos);
    })
}

function removerProdutoDaLista(id){
    let indice = listaDeProdutos.findIndex( produto => produto.id == id);

    listaDeProdutos.splice(indice, 1);
}
