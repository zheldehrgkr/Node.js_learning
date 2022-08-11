const EventEmitter = require("events");
const { listeners } = require("process");

const myEvent = new EventEmitter(); // 생성자 함수라서 파스칼 케이스

myEvent.addListener("event1", () => {
  console.log("1번 이벤트");
});

myEvent.on("event2", () => {
  console.log("얘도 등록임");
});
myEvent.emit("event1"); // 호출
myEvent.emit("event2");

const yes = () => {
  console.log("이렇게도 가능");
};
myEvent.on("event3", yes);
myEvent.emit("event3");
myEvent.removeListener("event3", yes);
myEvent.emit("event3"); // 작동 하지 않음
