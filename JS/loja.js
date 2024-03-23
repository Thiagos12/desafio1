const items = [
    {
        id: 0,
        nome: 'Camiseta Branca Feminina',
        img: './img/img-loja-fotos.jpg',
        quantidade: 0,
        valor: 19.99
    },
    {
        id: 1,
        nome: 'Short da Nike',
        img: './img/short-nike.png',
        quantidade: 0,
        valor: 44.59
    },
    {
        id: 2,
        nome: 'Camiseta do Barcelona',
        img: './img/camisa-barcelona.png',
        quantidade: 0,
        valor: 59.98
    }
];

inicializarloja = () => {
    var containerProdutos = document.getElementById('produtos')
    items.map((val) => {
        containerProdutos.innerHTML+= `

        <div class="produto-single">
        <img src="`+ val.img+`" />
        <p>`+val.nome+`</p>
        <a key="`+val.id+`"href="#" onclick="alert('Você adicionou ${val.nome} no Carrinho!')">Adicionar ao carrinho</a>
        </div>

        `;

    })
}

inicializarloja();

atualizarCarrinho = () => {
    var containerCarrinho = document.getElementById('carrinho')
    containerCarrinho.innerHTML = "";
    items.map((val) => {
        if(val.quantidade > 0){
        containerCarrinho.innerHTML+= `
        <div class="single-checkout">
        <p style="float:left;">Produto: `+val.nome+`</p><br>
        <p style="float:right;">Quantidade: `+val.quantidade+`</p><br><br>
        <p style="float:right;">Valor un: `+val.valor+`</p>
        <div style="clear:both"></div>
        </div>

        `;
        }

    })

}

var links = document.getElementsByTagName("a");

for(var i = 0; i < links.length; i++) {
    links[i].addEventListener( "click", function() {
        let key = this.getAttribute('key');
        items[key].quantidade++;
        atualizarCarrinho();
        return false;
})

};
