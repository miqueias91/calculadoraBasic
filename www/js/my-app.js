// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    var num = '0';
    var num1 = 0;
    var num2 = 0;
    var existenum1 = false;
    var opc_arit = '';
    var caracteresDigitados = 0;
    var resultado = 0;
    var ponto = false;
    var calculofinalizado = false;

    //Limpa a tela
    $( ".btn-limpartudo" ).click(function() {
        num = 0;
        ponto = false;
        num1 = 0;
        num2 = 0;
        opc_arit = '';
        caracteresDigitados = 0;
        resultado = 0;
        calculofinalizado = false;
        existenum1 = false;           

        $('#num1').html('');
        $('#num1').attr('num', '0');

        $('#num2').html('');
        $('#num2').attr('num', '0');

        $('#operador').html('');
        $('#valor-visor').html('0');
    });

    //Limpa ultimo caracter da tela
    $( ".btn-limparultimo" ).click(function() {
        if (num != '') {
            num = num.substring(0, num.length - 1);  
            if(num.indexOf(".") == -1){
                ponto = false;
            }          
        }

        if (num == '') {
            num = '0';
        }

        if(!ponto){
            $('#valor-visor').html(parseFloat(num));
        }
        else {
            $('#valor-visor').html(num);
        }
    });

    //insere ponto
    $( ".btn-ponto" ).click(function() {
        //insere apenas um ponto no visor
        if (!ponto) {
            num = parseFloat(num);            
            num += '.';                
            $('#valor-visor').html(num);
            ponto = true;
        }
    });

    $( ".btn-numero" ).click(function() {
        //pego o tamanho da string no visor
        caracteresDigitados = parseInt($("#valor-visor").val().length);

        //Se ainda a quantidade de digitos for menor que 9, deixo inserir
        if(parseInt(caracteresDigitados) < 8){
            num += $(this).attr('num')
            $('#valor-visor').html(parseFloat(num));
        }

        //Se num1 e num2 for igual a 0 significa que o usuario esta realizando um novo calculo, então limpo historico
        if (calculofinalizado) {
            $('#num1').html('');
            $('#num1').attr('num', '0');
            $('#num2').html('');
            $('#num2').attr('num', '0');

            $('#operador').html('');
            calculofinalizado = false;
        }
    });

    //Tipo da operacao aritmetica
    $( ".btn-calculo" ).click(function() {

        if (calculofinalizado) {
            num1 = $('#num1').attr('num');
            num2 = $('#num2').attr('num');
            opc_arit = $(this).attr('num'); 
            $('#operador').html(opc_arit);

            if (opc_arit == '+') {
                resultado = parseFloat(num1) + parseFloat(num2);
            }
            if (opc_arit == '-') {
                resultado = parseFloat(num1) - parseFloat(num2);
            }
            if (opc_arit == '/') {
                resultado = parseFloat(num1) / parseFloat(num2);
            }
            if (opc_arit == '*') {
                resultado = parseFloat(num1) * parseFloat(num2);
            }

            num = 0;
            num1 = 0;
            num2 = 0;
            resultado = resultado.toFixed(2);
            resultado = resultado.split(".");

            //Se depois do ponto o valor for igual a 0, não utilizo
            if (parseInt(resultado[1]) == 0) {
                resultado = resultado[0];
            }
            else{                
                resultado = resultado[0]+'.'+resultado[1];
            }
            $('#valor-visor').html(resultado);
            calculofinalizado = true; 
            existenum1 = true;
        }
        else {
            //Se num1 for maior q 0, significa que o usuario que apenas trocar o operador
            if (parseFloat(num1) > 0) {
                opc_arit = $(this).attr('num');            
            }
            else{
                num1 = $("#valor-visor").val();                
                opc_arit = $(this).attr('num'); 
                existenum1 = true;
            }
            $('#num1').html(num1);
            $('#num1').attr('num', num1);
            $('#operador').html(opc_arit);
            num = 0;
            $('#valor-visor').html('0');            
        }

    });

    //Calculo
    $( ".btn-igual" ).click(function() {
        if (existenum1) {
            num2 = $("#valor-visor").val();
            $('#num2').html(num2);
            $('#num2').attr('num', num2);

            if (opc_arit == '+') {
                resultado = parseFloat(num1) + parseFloat(num2);
            }
            if (opc_arit == '-') {
                resultado = parseFloat(num1) - parseFloat(num2);
            }
            if (opc_arit == '/') {
                resultado = parseFloat(num1) / parseFloat(num2);
            }
            if (opc_arit == '*') {
                resultado = parseFloat(num1) * parseFloat(num2);
            }

            num = 0;
            num1 = 0;
            num2 = 0;

            resultado = resultado.toFixed(2);
            resultado = resultado.split(".");

            //Se depois do ponto o valor for igual a 0, não utilizo
            if (parseInt(resultado[1]) == 0) {
                resultado = resultado[0];
            }
            else{                
                resultado = resultado[0]+'.'+resultado[1];
            }

            $('#valor-visor').html(resultado);
            calculofinalizado = true; 
            existenum1 = false;           
        }
    });   
});










$$(document).on('backbutton', function() {
    navigator.app.exitApp();
});

$$(document).on('click', '#sair', sair);

myApp.onPageInit('index', function (page) {
    $('.link').removeClass('ativo');
    $('._index').addClass('ativo');
})
myApp.onPageInit('about', function (page) {
    $('.link').removeClass('ativo');
    $('._sobre').addClass('ativo');
})
myApp.onPageInit('sair', function (page) {
    $('.link').removeClass('ativo');
    $('._sair').addClass('ativo');
})
function sair() {
    navigator.app.exitApp(); 
}