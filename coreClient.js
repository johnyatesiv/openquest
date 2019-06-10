var server = require('http').createServer();
server.listen(8888);

let coreClient
const io = require('socket.io')(server);
io.on('connection', function(client) {
    coreClient = client
})

export default coreClient