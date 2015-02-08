var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var compiler = require('brainish-compiler-backend');
var fs = require('fs');
var exec = require('child_process').exec;


app.use(require('express').static(__dirname + '/html'));

app.get('/bash.sh', function(req, res){
  res.sendFile(__dirname + '/bash');
});

console.log(compiler);
io.on('connection', function(client){

  client.on('compileJanish', function(msg){
    console.log(msg);

    console.log(JSON.stringify(compiler.simple2full(msg)));

    var bash = compiler.compileJSH(compiler.simple2full(msg));
    fs.writeFile('bash', bash, function (err,data) {
      if (err) {
        return console.log(err);
      } 
    });

    var brainish = compiler.decompile(compiler.simple2full(msg));
    client.emit('compilationFinished', {'bash':bash, 'brainish': brainish});
  });

  client.on('run', function(){
    console.log ("aaa");
    fs.readFile('./bash', 'utf8', function (err,data) {
       if (err) {
         return console.log(err);
       }
       console.log(data);
       exec(data, function(error, stdout, stderr){
         console.log (stdout);
         client.emit('result',stdout);
       });
    });
    //var bash = compiler.compileJSH(compiler.simple2full(msg));
    //client.emit ('result', bash);
  });
  // client.on('compileBrainish', function(msg){
    
  //   var bash = compiler.compileJSH(msg);
  //   fs.writeFile('bash', bash, function (err,data) {
  //     if (err) {
  //       return console.log(err);
  //     } 
  //   });
    
  //   exec(bash, function(error, stdout, stderr){ 
  //     console.log (stdout);
  //   });
  //   client.emit('compilationFinished', message);
  // });

  client.on('download', function(){
    client.sendFile(__dirname + '/bash');
  });

});

server.listen(8080, function(){
  console.log('listening on *: 8080');
});
