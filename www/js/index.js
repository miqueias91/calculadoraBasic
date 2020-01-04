var timeout = 5000;
var num_perg = 0;
// Pega a lista já cadastrada, se não houver vira um array vazio
window.fn = {};
window.fn.toggleMenu = function () {
  document.getElementById('appSplitter').right.toggle();
};

window.fn.loadView = function (index) {
  document.getElementById('appTabbar').setActiveTab(index);
  document.getElementById('sidemenu').close();
};

window.fn.loadLink = function (url) {
  window.open(url, '_blank');
};

window.fn.pushPage = function (page, anim) {
  if (anim) {
    document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title }, animation: anim });
  } else {
    document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title } });
  }
};

// SCRIPT PARA CRIAR O MODAL DE AGUARDE
window.fn.showDialog = function (id) {
  var elem = document.getElementById(id);      
  elem.show();            
};

//SCRIPT PARA ESCONDER O MODAL DE AGUARDE
window.fn.hideDialog = function (id) {
  document.getElementById(id).hide();
};

var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },
  // deviceready Event Handler    
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {    
    this.receivedEvent('deviceready');  
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    console.log('receivedEvent');
  },
  //FUNÇÃO DE BUSCA
  onSearchKeyDown: function(id) {
    if (id === '') {
      return false;
    }
    else{
      
    }
  },
  buscaPergunta: function(quiz,num_pergunta) {
    $("#textoquiz").html('');
    var quiz = quiz || "conhecimentosGeraisBiblicos";
    var selector = this;
    var texts = [];

    $.ajax({
      type : "GET",
      url : "js/"+quiz+".json",
      dataType : "json",
      /*error: function (request, status, erro) {
        alert("Problema ocorrido: " + status + "\nDescição: " + erro);
        console.log(request)
      },*/
      success : function(data){
        $(selector).each(function(){
          var ref = num_pergunta;
          var pergunta = null;
          var respostas = null;
          var resposta = null;
          var total_perguntas = 0;
          var obj = {
            id : num_pergunta,
            opcoes : ""
          };


         for(i in data){
            total_perguntas++
            if(i == obj.id){
                pergunta = data[i]['pergunta'];
                respostas = data[i]['opcoes'];
                resposta = data[i]['resposta'];
            }
          }
          if (pergunta) {            
            obj.opcoes = '<ons-list-header style="font-size: 30px;">'+pergunta+'</ons-list-header>';
            for (var i in respostas) {
              if (respostas[i]) {
                obj.opcoes += 
                  '<ons-list-item tappable style="font-size: 20px;">'+
                  '    <label class="left">'+
                  '      <ons-radio class="quiz_" input-id="quiz'+i+'" value="'+respostas[i]+'"></ons-radio>'+
                  '    </label>'+
                  '    <label for="quiz'+i+'" class="center">'+respostas[i]+'</label>'+
                  '</ons-list-item>';
              }
            }
          }
          obj.opcoes +=
            '<ons-list-item tappable modifier="longdivider" style="display: none;">'+
            '    <label class="left">'+
            '      <ons-radio class="quiz_" input-id="quiz_" value=""></ons-radio>'+
            '    </label>'+
            '    <label for="quiz_" class="center">nenhum</label>'+
            '</ons-list-item>';

          obj.opcoes +=
            '<section style="margin: 20px">'+
              '  <ons-button modifier="large" class="button-margin responder">RESPONDER</ons-button>'+
              '  <ons-row>'+
              '      <ons-col style="margin-right: 10px;">'+
              '          <ons-button modifier="large" class="button-margin pular">PULAR</ons-button>'+
              '      </ons-col>'+
              '      <ons-col>'+
              '          <ons-button modifier="large" class="button-margin eliminar">ELIMINAR</ons-button>'+
              '      </ons-col>'+
              '  </ons-row>'+
            '</section>';
          $("#textoquiz").html(obj.opcoes);

          var currentId = 'quiz_';
          var currentValue = '';
          const radios = document.querySelectorAll('.quiz_')
          for (var i = 0; i < radios.length; i++) {
            var radio = radios[i];
            radio.addEventListener('change', function (event) {
              if (event.target.value !== currentValue) {
                  document.getElementById(currentId).checked = false;
                  currentId = event.target.id;
                  currentValue = event.target.value;
              }
            })
          }

          $( ".responder" ).click(function() { 
            console.log(currentValue)
            if (currentValue != resposta) {
              ons.notification.alert({
                message: 'Resposta errada!',
                title: 'Mensagem',
              });
            }
            else{
              ons.notification.alert({
                message: 'Resposta certa!',
                title: 'Mensagem',
                callback: function (index) {
                  if (0 == index) {
                    num_perg++;
                    if (num_perg < total_perguntas) {              
                      app.buscaPergunta(quiz, num_perg);
                    }
                  }
                  else{
                    console.log(2);
                  }
                }
              });
            }
          });

          $( ".pular" ).click(function() { 
            num_perg++;
            if (num_perg < total_perguntas) {              
              app.buscaPergunta(quiz, num_perg);
            }
          });
        });        
      }
    });
  }
};

app.initialize();