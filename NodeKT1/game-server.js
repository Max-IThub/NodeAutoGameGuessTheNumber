const net = require('net');
const { EventEmitter } = require('events');

const gameEvents = new EventEmitter();

const server = net.createServer((socket) => {
  let min, max;

  gameEvents.on('sendAnswer', () => {
    const answer = Math.floor(Math.random() * (max - min + 1) + min);
    console.log(`Отправляю загаданное число: ${answer}`);
    socket.write(JSON.stringify({ answer }));
  });

  gameEvents.on('sendHint', (hint) => {
    console.log(`Получено подсказка: ${hint}`);
    // После получения подсказки отправляем ответ на следующий ход
    gameEvents.emit('sendAnswer');
  });

  socket.on('data', (data) => {
    const message = JSON.parse(data.toString());

    if (message.range) {
      const range = message.range.split('-');
      min = parseInt(range[0]);
      max = parseInt(range[1]);

      gameEvents.emit('sendAnswer');
    } else if (message.hint) {
      gameEvents.emit('sendHint', message.hint);
    }
  });

  socket.on('end', () => {
    console.log('Клиент отключен.');
    gameEvents.removeAllListeners();
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Готов к игре на порту ${port}...`);
});
