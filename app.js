const createServer = require("./server");
const mongoose = require("mongoose");
require("dotenv/config");

//MongoDB Connection
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`MongoDB Connected! ${process.env.DB_CONNECTION}`);
    const app = createServer();
    app.listen(process.env.PORT);
    console.log(`Server ready at http://localhost:${process.env.PORT}`);
  })
  .catch((err) => {
    console.log(err);
  });
