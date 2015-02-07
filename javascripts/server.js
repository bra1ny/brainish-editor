var server = io();
window.compile = function(janish){
  server.emit('compile', janish);
};