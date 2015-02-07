var server = io();
window.server = server;
window.compile = function(janish){
  server.emit('compileJanish', janish);
  server.emit('run', janish);
};