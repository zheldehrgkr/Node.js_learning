setInterval(() => {
  console.log("시작");
  try {
    throw new Error("서버 오류");
  } catch (err) {
    console.log(err);
  }
}, 1000);
