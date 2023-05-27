const app = require("./app");
const { serverPort } = require("./secret");
// listen on port 5000

app.listen(serverPort, () => {
  console.log(`listening on port ${serverPort}`);
});
