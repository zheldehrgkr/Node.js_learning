const fs = require("fs");

console.log("시작");

fs.readFile("./readme.txt", (err, data) => {
  if (err) {
    throw err;
  }
  console.log(data);
  console.log(data.toString());
});

console.log("비동기임을 증명하자");
