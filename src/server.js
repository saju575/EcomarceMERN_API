const app = require("./app");
const connectDB = require("./config/db.config");
const { serverPort } = require("./secret");
// listen on port 5000

app.listen(serverPort, async () => {
  console.log(`listening on port ${serverPort}`);
  await connectDB();
});
