const fs = require('fs');

fs.readFile('./1.txt', (err, data) => {
  if (err) {
    console.log(err);
  }
  console.log(data);
  console.log(data.toString());
});
