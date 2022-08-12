const fs = require('fs');

const readStream = fs.createReadStream('./1.txt', { highWaterMark: 16 });
const data = [];

readStream.on('data', (chunk) => {
  data.push(chunk);
  console.log(chunk);
});

readStream.on('end', () => {
  console.log(Buffer.concat(data).toString());
});

readStream.on('error', (err) => {
  console.error(err);
});
