var StaticServer = require('static-server');

server = new StaticServer({
  rootPath: './public/',
  port: 3000
});

server.start(function(){
  console.log('Server Started on port' + server.port);
});
