const fs = require("fs");

const readStream = fs.createReadStream("./readme.txt", { highWaterMark: 16 });
const data = [];

readStream.on("data", (chunk) => {
  // 'data'는 이벤트이다
  data.push(chunk);
  console.log("data :", chunk, chunk.length);
}); // 스트림 청크 단위로 출력

readStream.on("end", () => {
  console.log("end :", Buffer.concat(data).toString());
}); // 버퍼 (그리고 toString)로 리턴

readStream.on("error", (err) => {
  console.log("error :", err);
});
