const net = require('net');

const client = new net.Socket();
const port = 3000;

let min, max;

const range = process.argv.slice(2).map(Number);
[min, max] = range;
const initialRange = `${min}-${max}`;

client.connect(port, '127.0.0.1', () => {
  client.write(JSON.stringify({ range: initialRange }));
});

client.on('data', (data) => {
  const message = JSON.parse(data.toString());

  if (message.answer) {
    console.log(`Получен ответ от сервера: ${message.answer}`);

    const guess = Math.floor((max + min) / 2);

    if (guess < message.answer) {
      console.log(`Отправляю подсказку: more`);
      client.write(JSON.stringify({ hint: 'more' }));
    } else if (guess > message.answer) {
      console.log(`Отправляю подсказку: less`);
      client.write(JSON.stringify({ hint: 'less' }));
    } else {
      console.log('Угадано! Игра завершена.');
      client.end();
    }
  }
});

client.on('close', () => {
  console.log('Соединение закрыто.');
});
