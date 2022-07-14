console.time("stopwatch1");
for (let i = 0; i < 39537; i++) {}
console.timeEnd("stopwatch1");

process.exit();

const obj = { name: "adam", height: "180cm" };

console.table([
  { name: "adam", height: "180cm" },
  { name: "eve", height: "168cm" },
]);

console.log("a", "b");

console.dir(obj, { colors: true });
