const buffer = Buffer.from("나를 바꾸어봐");

console.log(buffer);
console.log(buffer.toString());

const arr = [Buffer.from("안"), Buffer.from("녕"), Buffer.from("반가워")];
console.log(Buffer.concat(arr));
console.log(Buffer.concat(arr).toString());
console.log(Buffer.alloc(10));
