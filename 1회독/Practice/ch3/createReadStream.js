const fs = require("fs");

const readStream = fs.createReadStream("./readstream.txt", {
  highWaterMark: 16,
});
const data = [];

readStream.on("data", (chunk) => {
  data.push(chunk);
  console.log("data", chunk, chunk.length);
});

readStream.on("end", () => {
  console.log(data);
  console.log(data[1].toString());
  console.log(Buffer.concat(data).toString());
});

readStream.on("err", () => {
  console.log(err);
});
