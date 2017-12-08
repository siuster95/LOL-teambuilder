let io;

const setupSockets = (ioIn) => {
  io = ioIn;

  io.on('connection', (sock) => {
    const socket = sock;

    socket.join('lobby');

    console.log('someone has joined');

    socket.emit('joined', {});

    socket.on('disconnect', () => {
      socket.leave('lobby');
      socket.leave(`${socket.room}`);
      console.log('someone leaves');
    });

    socket.on('makeTeam', (data) => {
           // tell socket which room it is in and the name
      console.log(`${data.name} is making ${data.team}`);
      socket.team = data.team;
      socket.name = data.name;
           // telll socket to join a room
      socket.leave('lobby');
      socket.join(`${data.team}`);
    });

    socket.on('jointeam', (data) => {
           // tell socket which room it is in and the name
      console.log(`${data.name} is joining ${data.team}`);
      socket.team = data.team;
      socket.name = data.name;
           // telll socket to join a room
      socket.leave('lobby');
      socket.join(`${data.team}`);
    });

    socket.on('leaveteam', () => {
      console.log(`${socket.name} is leaving ${socket.team}`);
      socket.leave(`${socket.team}`);
      socket.join('lobby');
      socket.team = '';
    });

    socket.on('msgToServer', (data) => {
      io.sockets.in(`${socket.team}`).emit('msg', { name: socket.name, msg: data.msg });
    });
  });
};

module.exports.setupSockets = setupSockets;
