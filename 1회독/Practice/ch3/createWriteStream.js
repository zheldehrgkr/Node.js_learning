const fs = require("fs");

const writeStream = fs.createWriteStream("./writestream.txt");

writeStream.on("finish", () => {
  console.log("파일 작성 완료");
});

writeStream.write("여기에 쓴 글이\n");
writeStream.write("작성된다");
writeStream.end();
