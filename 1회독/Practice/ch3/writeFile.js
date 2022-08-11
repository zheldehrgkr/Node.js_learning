const fs = require("fs").promises;

fs.writeFile("./me.txt", "파일 작성")
  .then(() => {
    return fs.readFile("./me.txt");
  })
  .then((data) => {
    console.log(data);
    console.log(data.toString());
  })
  .catch((err) => {
    console.log(err);
  });
