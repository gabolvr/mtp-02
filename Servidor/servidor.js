const porta = 8080;
var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/dados');
var User = mongoose.model('User', {username: String, password: String})  //É ao mesmo tempo uma "classe" e uma collection na database

var app = express();
app.use(bodyParser.urlencoded({extended: false}));  // especifica opcoes de parsing


app.use(express.static(__dirname));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/home.html');
});

//// pages do hackathon
app.get('/comofunciona', function(req, res){
    res.sendFile(__dirname + '/comofunciona.html');
});


app.get('/historias', function(req, res){
    res.sendFile(__dirname + '/historias.html');
});

app.get('/sobre', function(req, res){
    res.sendFile(__dirname + '/sobre.html');
});

app.get('/contato', function(req, res){
    res.sendFile(__dirname + '/contato.html');
});

//////////
//////////
app.get('/entrar', function(req, res){ // página de login
    res.sendFile(__dirname + '/entrar.html');
});


app.get('/cadastro', function(req, res){ //página de cadastro
    res.sendFile(__dirname + '/cadastro.html');
});


app.post('/logar', function(req, res){ // tentativa de login
    var nomeUsuario = req.body.usuario;
    var senha = req.body.senha;
    console.log(nomeUsuario);
    var user1 = new User({username: nomeUsuario, password: senha});

    User.findOne({username: nomeUsuario, password: senha}, function (err, encontrado){
        if(encontrado==null) // Errou o login
        {
            res.sendFile(__dirname + '/re_entrar.html');
        }
        else { // Acertou  o login, vou logar ele
            res.sendFile(__dirname + '/sucesso.html');
            //document.getElementById('1').innerHTML=nomeUsuario
        }

    })

});


app.post('/cadastrar', function(req, res){ //tentativa de cadastro
    var nomeUsuario = req.body.usuario;
    var senha = req.body.senha;
    var user1 = new User({username: nomeUsuario, password: senha});
    User.findOne({username: nomeUsuario}, function (err, encontrado){
        if(encontrado==null) // Não tem ninguém com esse nome de usuário -> Posso cadastrar
        {
            user1.save(function (err, userObj) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('saved successfully:', userObj);
                }
            });
            res.sendFile(__dirname + '/entrar.html');
        }
        else { // Tenho que mandar refazer o cadastro
            res.sendFile(__dirname + '/re_cadastro.html');
        }

    })


});


app.listen(porta, function(){
    console.log('listening at port '+porta);
});
