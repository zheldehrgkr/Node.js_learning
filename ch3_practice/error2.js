process.on("uncaughtException", (err) => {
  console.log("예상치 못한 에러", err);
});

setInterval(() => {
  throw new Error("에러 발생");
}, 1000);

setTimeout(() => {
  console.log("동작할까?");
}, 2000);
