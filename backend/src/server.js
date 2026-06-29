const app = require("./app");
const { port } = require("./config");

app.listen(port, () => {
  console.log(`SARA backend listening on port ${port}`);
});
