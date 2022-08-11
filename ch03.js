const yes = '변수';

const obj = { a: 1 };

function add(x, y) {
  return x + y;
}

module.exports = { yes, obj, add };

console.dir(module.exports);
console.dir(exports);
console.dir(require);

console.log(__filename);
console.log(__dirname);
