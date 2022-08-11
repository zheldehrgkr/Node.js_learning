const exec = require("child_process").exec;

const process = exec("ls");

process.stdout.on("data", function (data) {
  console.log(data.toString());
});
