const EMAIL = "admin@admin.com";
const SENHA = "123456"

let campoEmail = document.querySelector("#email");
let campoSenha = document.querySelector("#senha");
let btnentrar = document.getElementById('btn-entrar');


btnentrar.addEventListener("click", () =>  {
    // Capiturando os valores digitados pelo usuario
    let emaildigitado = campoEmail.value.toLowerCase();
    let senhadigitada = campoSenha.value;


    autenticar(emaildigitado, senhadigitada);
    
});

function autenticar (email, senha){
    //Preciso saber url da API
    const URL ='http://localhost:3400/login'

    // Criar um request para API
    fetch(URL, {
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email,senha}) 
    })
    // Se der certo, direcionar para a tela de home
    .then(response => response = response.json())
    .then( response => {
        console.log(response)

        if(!!response.mensagem){
            alert(response.mensagem);
            return;
        }
//mostrar loading
        mostrarloading();

        salvarToken(response.token);
        salvarUsuario(response.usuario);

        setTimeout(() => {
            window.open('controle-produtos.html', '_self')
        },3000)

    })
    // Se der errado, mandar mensagem para usuario
    .catch(erro => {
        console.log(erro)
    })


}

function mostrarloading(){
    // Capturar campo de loading e mostrar ele na tela
    const divloading = document.getElementById("loading");
    divloading.style.display = "block";
    // pegar elemento caixa de login e esconder ela
    const divmainlogin = document.querySelector('div.main-login');
    divmainlogin.style.display = "none";
}
