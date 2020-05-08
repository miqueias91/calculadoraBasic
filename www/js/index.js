var timeout = 5000;
var num_perg = 0;
var acertos = 0;
var erros = 0;
var lista_score = JSON.parse(localStorage.getItem('lista-score') || '[]');
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
function maxArray(array) {
  return Math.max.apply(Math, array);
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
    else{}
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
            obj.opcoes = '<ons-list-header style="font-size: 25px;">'+(num_pergunta+1)+' - '+pergunta+'</ons-list-header>';
            for (var i in respostas) {
              if (respostas[i]) {
                obj.opcoes += 
                  '<ons-list-item tappable style="font-size: 20px;">'+
                  '    <label class="left">'+
                  "      <ons-radio class='quiz_' input-id='quiz"+i+"' value='"+respostas[i]+"'></ons-radio>"+
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
              '  <ons-button modifier="large" style="padding: 10px;box-shadow:0 5px 0 #ccc;" class="button-margin responder">RESPONDER</ons-button>'+
              '  <ons-row>'+
              '      <ons-col style="margin-right: 10px;">'+
              '          <ons-button modifier="large" style="padding: 10px;box-shadow:0 5px 0 #ccc;" class="button-margin pular">PULAR</ons-button>'+
              '      </ons-col>'+
              '      <ons-col>'+
              '          <ons-button modifier="large" style="padding: 10px;box-shadow:0 5px 0 #ccc;" class="button-margin finalizar">FINALIZAR</ons-button>'+
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
            if (currentValue != '') {
              if (currentValue != resposta) {
                erros++
                ons.notification.alert({
                  message: 'Resposta errada!',
                  title: 'Mensagem',
                });
              }
              else{
                acertos++
                ons.notification.alert({
                  message: 'Resposta certa!',
                  title: 'Mensagem',
                  callback: function (index) {
                    if (0 == index) {
                      num_perg++;
                      if (num_perg < total_perguntas) {              
                        app.buscaPergunta(quiz, num_perg);
                      }
                      else{
                        if (acertos > 0) {
                          lista_score.push(acertos);
                          localStorage.setItem("lista-score", JSON.stringify(lista_score));              
                        }
                        ons.notification.alert({
                          message: 'Parabêns! Você chegou ao fim do quiz.<br><br>Sua pontuação: '+acertos,
                          title: 'Mensagem',
                          callback: function (index) {
                            if (0 == index) {
                              location.href = 'index.html';
                            }
                            else{
                            }
                          }
                        });
                      }
                    }
                    else{
                    }
                  }
                });
              }
              currentId = 'quiz_';
              currentValue = '';
              $('.quiz_').prop('checked', false);
              $('#acerto').html('Acertos: '+acertos);
              $('#erro').html('Erros: '+erros);
            }
            else{
              ons.notification.alert({
                message: 'Escolha uma opção!',
                title: 'Mensagem',
              });
            }
          });

          $( ".pular" ).click(function() { 
            currentId = 'quiz_';
            currentValue = '';
            num_perg++;
            if (num_perg < total_perguntas) {              
              app.buscaPergunta(quiz, num_perg);
            }
          });

          $( ".finalizar" ).click(function() { 
            if (acertos > 0) {
              lista_score.push(acertos);
              localStorage.setItem("lista-score", JSON.stringify(lista_score));              
            }
            ons.notification.alert({
              message: 'Sua pontuação: '+acertos,
              title: 'Mensagem',
              callback: function (index) {
                if (0 == index) {
                  location.href = 'index.html';
                }
                else{
                }
              }
            });
          });
        });        
      }
    });
  }
};

app.initialize();