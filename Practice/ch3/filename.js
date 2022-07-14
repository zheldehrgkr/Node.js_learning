const path = require("path");
const { URL } = require("url");

console.log(__filename);
setImmediate(() => console.log("when?"));
console.log(__dirname);
console.log(module.exports === exports);

console.log(path.dirname(__filename));

const myURL = new URL(
  "https://www.google.com/search?q=how+to+biuld+blockchain+birdge&rlz=1C5CHFA_enKR1013KR1013&oq=how+to+biuld+blockchain+birdge&aqs=chrome..69i57j0i19.12271j1j4&sourceid=chrome&ie=UTF-8"
);

console.log(myURL.searchParams);
console.log(myURL.searchParams.keys());
