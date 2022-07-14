const os = require("os");
const path = require("path");
const url = require("url");

const { URL } = url;

// console.log(os.constants);

// const string = __filename;

// console.log(path.sep);
// console.log(path.parse(string));
// console.log(path.parse(__dirname));

const myURL = new URL(
  "http://blockchainer.com.s3-website.ap-northeast-2.amazonaws.com/"
);

console.log(myURL);
console.log(
  url.parse("http://blockchainer.com.s3-website.ap-northeast-2.amazonaws.com/")
);
