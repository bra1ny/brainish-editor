var server = io();
window.compile = function(janish){
  server.emit('compileJanish', janish);
};