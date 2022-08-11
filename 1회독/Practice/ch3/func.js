const { odd, even } = require("./var"); // 객체를 불러오고 경로 설정

function checkOddOrEven(num) {
  if (num % 2) {
    // 1, 즉 truthy한 값이면
    return odd;
  }
  return even;
}

console.log(checkOddOrEven(5));
console.log(checkOddOrEven(6));

module.exports = checkOddOrEven;
// 모듈 사용 파일을 모듈로 다시 내보낼 수 있고, 지금 checkOddOrEven 처럼 함수도 export 가능
