const express = require("express");

const { sequelize } = require("./models");

const app = express();
app.set("port", process.env.PORT || 3000);

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "포트에서 대기 중");
});
