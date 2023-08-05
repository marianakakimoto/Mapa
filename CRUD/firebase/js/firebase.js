const firebaseConfig = {
    apiKey: "AIzaSyC0b7trWANVHlnwkXGcFZPcvhpq4Jluep0",
    authDomain: "kakimoto-mapa.firebaseapp.com",
    databaseURL: "https://kakimoto-mapa-default-rtdb.firebaseio.com",
    projectId: "kakimoto-mapa",
    storageBucket: "kakimoto-mapa.appspot.com",
    messagingSenderId: "360414735919",
    appId: "1:360414735919:web:a4c63fdabb5441e2ffa0da"
  };

  //Inicializando o Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database()
  
  const urlApp = "http://127.0.0.1:5500"

  function loginGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider).then((result) => { 
    window.location.href = `${urlApp}/home.html`}).catch((error) => {
      alert(`Erro ao efetuar login ${error.message}`)
    })
    }
  
  function verificaLogado(){
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        //Salvamos o id do user localmente
        localStorage.setItem('usuarioId', user.vid)
        //Inserindo a imagem do usuário
        let imagem = document.getElementById('imagemUsuario')

        user.photoURL ? imagem.innerHTML += `<img src='${user.photoURL}' alt="Foto do usuário" title='${user.displayName}' class="img rounded-circle" width="48"/>`: `<img src="images/logo-google.svg" class="img rounded-circle" width="48"></img>`
      } else {
        console.error("Usuário não logado!")
        window.location.href = `${urlApp}/`
      }
    })
  }

  function logoutFirebase(){
    firebase.auth().signOut().then(function(){
      localStorage.removeItem('usuarioId') 
      window.location.href = `${urlApp}/`
    })
    .catch(function(error){
      alert(`Não foi possível fazer o logout: ${error.message}`)
    })
  }

  async function salvaEstabelecimento(estabelecimento){
    let usuarioAtual = firebase.auth().currentUser 

    return await firebase.database().ref('estabelecimentos').push({
      ... estabelecimento,
      usuarioInclusao: {
        uid: usuarioAtual.uid,
        nome: usuarioAtual.displayName
      }
    }).then(() => {
      alert('Registro incluído com sucesso!')
      //limpa o form
      document.getElementById('formCadastro').reset()
    }).catch(error => {
      alert(`Erro ao salvar: ${error.message}`)
    })
  }